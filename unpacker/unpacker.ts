import fs from 'fs';
import path from 'path';
import process from 'process';

/**
 * Unpacks files in a folder.
 *
 * @param pathName Path to the folder in which files will be unpacked
 * @param bundleId The bundle ID to fetch (created via a POST to /run.api)
 */
async function unpack(pathName: string, bundleId: string) {
  try {
    const response = await fetch(`https://idx.google.com/run.api?bundleId=${bundleId}`);
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    let responseText = await response.text();

    // trim JSON safety prefix if present
    responseText = responseText.trim().replace(/^\)\]\}\'\n?/, '');

    const responseJson = JSON.parse(responseText) as {files?: {[key: string]: string}};
    const {files} = responseJson;
    if (!files) {
      throw new Error('No files');
    }
    console.log('files', files);

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
    console.log('Files unpacked successfully!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Need bundleId arg');
    process.exit(1);
  }

  console.log('Unpacking...');
  const [path, bundleId] = args;
  await unpack(path, bundleId);
}

main();
