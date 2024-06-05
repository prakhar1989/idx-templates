import fs from 'fs';
import path from 'path';
import process from 'process';

interface ImportBundle3P {
  files?: {[key: string]: string};
  settings?: {
    baselineEnvironment?: string;
  };
}

interface InstantiatorContext {
  resPath: string;
  destPath: string;
  bundle: ImportBundle3P;
}

const ENVIRONMENT_INSTANTIATORS: Record<string, (ctx: InstantiatorContext) => Promise<void>> = {
  '': instantiateDefault,
  flutter: instantiateFlutter,
};

/**
 * Main unpacker flow.
 */
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Need bundleId arg');
    process.exit(1);
  }

  try {
    console.log('Fetching bundle...');
    const [resPath, destPath, bundleId] = args;
    console.log(resPath, fs.readdirSync(resPath));
    const bundle = await fetchBundle(bundleId);
    const baselineEnvironment = bundle.settings?.baselineEnvironment || '';
    console.log(`Unpacking bundle using environment: ${baselineEnvironment || '(default)'}...`);
    const instantiator = ENVIRONMENT_INSTANTIATORS[baselineEnvironment];
    if (!instantiator) {
      throw new Error(`Unknown environment: ${baselineEnvironment}`);
    }
    await instantiator({resPath, destPath, bundle});
    console.log('Unpacked successfully!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * Flutter-specific unpacker that first renames the existing /home/user/myapp (which should
 * have a dev.nix file) to the destination path and then unpacks the bundle there.
 */
async function instantiateFlutter({destPath, bundle}: InstantiatorContext) {
  fs.rmSync(destPath, {recursive: true});
  // destPath and /home/user/myapp should be on the same filesystem/device
  fs.renameSync('/home/user/myapp', destPath);
  await unpackFiles(destPath, bundle);
}

/**
 * Default instantiator that unpacks files to an entirely empty directory.
 */
async function instantiateDefault({resPath, destPath, bundle}: InstantiatorContext) {
  fs.mkdirSync(path.resolve(destPath, '.idx'), {recursive: true});
  const devnixPath = path.resolve(destPath, '.idx/dev.nix');
  fs.cpSync(path.resolve(resPath, 'dev.nix'), devnixPath);
  fs.chmodSync(devnixPath, 0o644);
  await unpackFiles(destPath, bundle);
}

/**
 * Fetches the given import bundle as a JSON blob, with possibly safety prefix.
 */
async function fetchBundle(bundleId: string) {
  const response = await fetch(`https://idx.google.com/run.api?bundleId=${bundleId}`);
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  let responseText = await response.text();

  // trim JSON safety prefix if present
  responseText = responseText.trim().replace(/^\)\]\}\'\n?/, '');

  const responseJson = JSON.parse(responseText) as ImportBundle3P;
  const {files} = responseJson;
  if (!files) {
    throw new Error('Empty bundle');
  }
  return responseJson;
}

/**
 * Unpacks files from a bundle into a folder.
 *
 * @param pathName Path to the folder in which files will be unpacked
 * @param bundle The bundle to unpack
 */
async function unpackFiles(pathName: string, {files}: ImportBundle3P) {
  if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName, {recursive: true}); // Create nested directories if needed
  }

  for (const fileName in files) {
    const filePath = path.resolve(pathName, fileName);
    const folder = path.dirname(filePath);
    // create the folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }
    fs.writeFileSync(filePath, files[fileName]);
  }
}

main();
