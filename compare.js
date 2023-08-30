const { RTFileToImage } = require('./gt-parser/rttexConverter.js');

const fs = require('fs');
const { join } = require('path');

async function ls(oldPath, newPath) {
	// const [resultFolder] = options;

  // const dir = await fs.promises.opendir(path);

	let changes = [];
	
	const oldFiles = await fs.promises.readdir(oldPath);
	const newFiles = await fs.promises.readdir(oldPath);

	for (const newFile of newFiles){
		if (oldFiles.includes(newFile)) continue;

		changes.push(newFile);
	}

	console.log(changes);
}

ls('./output/images/', './output/images - Copy');
