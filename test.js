const { RTFileToImage } = require('./gt-parser/rttexConverter.js');

const fs = require('fs');
const { join } = require('path');

async function ls(path, ...options) {
	const [resultFolder] = options;

  const dir = await fs.promises.opendir(path);

  for await (const fileEntry of dir) {
		const filePath = join(path, fileEntry.name);

		if (filePath.includes('.') && !filePath.endsWith('.rttex'))
			continue;

		const stats = await fs.promises.lstat(filePath);

		if (stats.isDirectory()){
			console.log(fileEntry.name, stats.isDirectory());

			ls(filePath, ...options);
		}

		if (stats.isFile() && filePath.endsWith('.rttex')){
			const image = new RTFileToImage(filePath);
			const newDir = join(resultFolder, fileEntry.name).replace(/.rttex/g, '.png');

			image.write(newDir);
		}
  }
}

let pathInputs = [
	'C:\\Users\\moshl\\AppData\\Local\\Growtopia\\cache',
	'E:\\Apps\\Growtopia'
];

for (const path of pathInputs)
	ls(path, './output/images/')
	.catch(console.error);
