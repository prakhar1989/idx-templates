import fs from 'fs';
import path from 'path';

/**
 * Unpacks files in a folder.
 * 
 * @param pathName Path to the folder in which files will be unpacked
 * @param filesStr JSONified mapping of files to file contents such as 
 * 
 * {"index.html": "...", "README.md": "hello", "src/app.js": "console.log(2+2)"}
 */
function unpack(pathName: string, filesStr: string) {
    try {
        const files: { [key: string]: string } = JSON.parse(filesStr);
        console.log("files", files);

        if (!fs.existsSync(pathName)) {
            fs.mkdirSync(pathName, { recursive: true }); // Create nested directories if needed
        }

        for (const fileName in files) {
            const filePath = pathName + '/' + fileName;
            const folder = path.dirname(filePath);
            // create the folder if it doesn't exist
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
            fs.writeFileSync(filePath, files[fileName]);
        }
        console.log('Files unpacked successfully!')
    } catch (e) {
        console.error(e);
    }
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("Need files (JSON) args");
        process.exit(1);
    }

    console.log("Unpacking...");
    const [path, files] = args;
    unpack(path, files);
}

main();
