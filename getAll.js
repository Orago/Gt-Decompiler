import { parse, save } from './gt-parser/main.js';

const newParsed = parse(
	'C:\\Users\\moshl\\AppData\\Local\\Growtopia\\cache\\items.dat',
	undefined,
	item => item
);

save(newParsed, 'output/build.json');