const { parse, save, compare_items } = require('./gt-parser/main');

const newParsed = parse(
	'versions/3_2_2023.dat',
	undefined,
	item => item
);

save(newParsed, 'output/build.json');