const { parse, save, compare_items } = require('./gt-parser/main');

const newParsed = parse(
	'versions/items.dat',
	undefined,
	item => item
);

save(newParsed, 'output/test.json');