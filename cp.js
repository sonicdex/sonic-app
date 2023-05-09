const fs = require('fs');

function copyFile(source, dest){
    try {
        const readStream = fs.createReadStream(source);
        const writeStream = fs.createWriteStream(dest);
        readStream.pipe(writeStream);
        writeStream.on('finish', () => {console.log('File copied successfully.');});
    } catch (error) {
        console.log('File copy error');
    }
   
}

copyFile(process.argv[2],process.argv[3])