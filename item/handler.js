import { newNode as node, qs, generateProxyNode} from '../mittz/v17.js';
import query from '../mittz/query.js';
import itemData from '../output/build.json' assert { type: 'json' };
import { brush } from './engine/main.js';
import sprites from './engine/_sprites.js';

let itemSprites = new sprites();


const itemArray = Object.entries(itemData.items);

const asyncSleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const generateItemContent = async item => {
	const spriteCanvas = new brush([32, 32]).setSmoothing(false);

	spriteCanvas.shape({
		color: 'red',
		x: 0,
		y: 0,
		w: spriteCanvas.width(),
		h: spriteCanvas.height()
	});
	
	return node.div.class('hidechildren')(
		node.hr,
	
		node.div.class('container center-box')(
			generateProxyNode(
				spriteCanvas.canvas
			).class('w-20 aspect-ratio'),

			// node.img.class('w-20 aspect-ratio')
			// .styles({
			// 	background: `url(${
			// 		`/output/images/${item.textureName.replace(/.rttex/g, '.png')}`
			// 	}) no-repeat calc(-32px * ${item.textureX}) calc(-32px * ${item.textureY})`
			// 	//url("/output/images/player_shirt.png") 0px 0px / calc(100% * 8)
			// }),
			node.p(`Name: ${item.name}`),
			node.p(`ID: ${item.ID}`),
			node.p(`Rarity: ${item.rarity}`),

			node.hr,

			node.p(`Hits To Break: ${item.breakHits}`),
			node.p(`Collision: ${item.collisionType}`),
			node.p(`Drop Chance: ${item.dropChance}`),
			node.p(`Max Amount: ${item.maxAmount}`),

			node.hr,
			
			node.div.class('container center-box')(
				node.h2('Texture'),
				node.hr,

				node.p(`Hash: ${item.textureHash}`),
				node.p(`Length: ${item.textureLength}`),
				node.p(`Name: ${item.textureLength}`),
				node.h3('Coordinates'),
				node.hr,
				node.p(`X: ${item.textureX}`),
				node.p(`Y: ${item.textureY}`)
			),
		)
	);
}

const buildItem = item => {
	let loaded = false;

	const contentNode = node.div;

	const itemElement = node.div.class('container center-box collapsed')(
		node.div.class('flex flex-row justify-space-between')(
			node.h1(`${item.name}`),
			node.button.class('font-smasher')(
				node.h4('COLLAPSE')
			)
			.on('click', async () => {
				itemElement.toggleClass('collapsed');
				
				if (loaded == false){
					loaded = true;

					contentNode.swap(
						await generateItemContent(item)
					);
				}
			})
		),

		contentNode
	);

	return itemElement;
}

async function delayGenerateItems ({ container, items, ms = 200 }) {
	for (let [name, item] of items){
		await asyncSleep(ms);

		container(
			buildItem(item)
		);
	}
}

function findItems (text, { startsWith, endsWith, includes } = {}){
	if (typeof text !== 'string' || text.length < 3) return [];

	return itemArray.filter(([ID]) => (
			ID == text ||
			(includes == true && ID.includes(text)) ||
			(startsWith == true && ID.startsWith(text)) ||
			(endsWith == true && ID.endsWith(text))
		)
	);
}

async function run (containerSelector){
	const container = qs(containerSelector);
	const itemsNode = node.div;

	let searchValue = '';

	const updateItems = () =>
		delayGenerateItems({
			container: itemsNode,
			items: findItems(searchValue, {
				includes: boxes.includes.checked,
				startsWith: boxes.startsWith.checked,
				endsWith: boxes.endsWith.checked,
			})
		});

	const boxes = {
		includes:   node.input.attr({ type: 'checkbox', checked: true })(`Starts With <text>`).on('change', updateItems),
		startsWith: node.input.attr({ type: 'checkbox' })(`Starts With <text>`).on('change', updateItems),
		endsWith:   node.input.attr({ type: 'checkbox' })(`Ends With <text>`).on('change', updateItems)
	}

	container(
		node.nav.class('main')(
			node.a('GT ARCHIVE').attr({ href: '/' }).class('title')
		),

		node.h1.class('align-text-center')('Items'),

		node.div.class('container center-box')(
			...Object.entries(boxes).map(([name, boxEl]) => {
				return node.div(
					name,
					boxEl
				);
			}),
	
			node.input.attr({
				placeholder: 'item name'
			}).on('keyup', function() {
				searchValue = this.value;

				updateItems();
			})
		),

		node.hr.class('w-80'),

		itemsNode
	);
}

export {
	run
};