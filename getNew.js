
const { parse, save } = require('./items-decompiler.js');


doWithParsed: {
	const oldParsed = parse('items-old.dat').items;
	const newParsed = parse('items.dat');
	const oldKeys = Object.keys(oldParsed);

	const newItems = [];
	
	for (let [name, data] of Object.entries(newParsed.items))
		if (!oldKeys.includes(name))
			newItems.push(name);

	newParsed.items = newItems;

	save(newParsed);
}