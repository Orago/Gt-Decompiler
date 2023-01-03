const itemsData = require('../output/items.json');

const item_map = new Map();
const item_names = [];

for (let item of itemsData.items){
	item_map.set(item.name, item);
	item_names.push(item.name);
}

const findItems = queryText => {
	const items = [];

	if (typeof queryText != 'string' || queryText.length <= 2) return {
		status: false,
		response: 'Please provide a search of more than 3 letters',
		items
	}

	for (let item_name of item_names)
		if (item_name.includes(queryText))
			items.push(item_name);

	return {
		status: true,
		items
	}
}

const getItemData = name => item_map.get(name)


module.exports = {
	findItems,
	getItemData
}