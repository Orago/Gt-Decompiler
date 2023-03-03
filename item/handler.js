import { newNode as node, qs, generateProxyNode} from '../mittz/v17.js';
import query from '../mittz/query.js';
import itemData from '../output/build.json' assert { type: 'json' };
import { brush } from './engine/main.js';
import sprites from './engine/_sprites.js';

const itemSprites = new sprites();

const itemArray = Object.entries(itemData.items);

const asyncSleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const generateItemContent = async item => {
	console.log(item)
	const info = (text) => node.div(text).class('info');

	return node.div.class('hidechildren')(
		node.hr,
	
		node.div.class('container')(
			info(`Name: ${item.name}`),
			info(`ID: ${item.ID}`),
			info(`Rarity: ${item.rarity}`),

			node.hr,

			info(`Hits To Break: ${item.breakHits}`),
			info(`Collision: ${item.collisionType}`),
			info(`Drop Chance: ${item.dropChance}`),
			info(`Max Amount: ${item.maxAmount}`),

			node.hr,
			
			node.div.class('container')(
				node.h2('Texture'),
				node.hr,

				info(`Hash: ${item.textureHash}`),
				info(`Length: ${item.textureLength}`),
				info(`Name: ${item.textureLength}`),
				node.h3('Coordinates'),
				node.hr,
				info(`X: ${item.textureX}`),
				info(`Y: ${item.textureY}`)
			),
		)
	);
}

const buildItem = async item => {
	let loaded = false;

	const contentNode = node.div;

	const spriteCanvas = new brush([32, 32]).setSmoothing(false);
	const sprite = await itemSprites.promise(`/output/images/${item.textureName.replace(/.rttex/g, '.png')}`);

	spriteCanvas.image(
		sprite,
		[
			32 * item.textureX,
			32 * item.textureY,
			32,
			32
		],
		[
			0,
			0,
			spriteCanvas.width(),
			spriteCanvas.height()
		]
	);

	const itemElement = node.div.class('container center-box collapsed')(
		node.div.class('flex flex-row justify-space-between').styles({ height: '50px' })(
			generateProxyNode(
				spriteCanvas.canvas
			)
			.class('h-100 aspect-ratio pixel-perfect'),

			node.h1(`${item.name}`).styles({ fontSize: '20px' }),

			node.button.class('font-smasher')('COLLAPSE')

			.on('click', async () => {
				
				if (loaded == false){
					loaded = true;

					contentNode.swap(
						await generateItemContent(item)
					);
				}

				itemElement.toggleClass('collapsed');

			})
		),

		contentNode
	);

	return itemElement;
}

async function delayGenerateItems ({ container, items, ms = 200 }) {
	for (let [name, item] of items){
		// await asyncSleep(ms);

		buildItem(item).then(container);
	}
}

function findItems (text, { startsWith, endsWith, includes } = {}){
	if (typeof text !== 'string' || text.length < 3) return [];


	return itemArray.filter(([ID]) => {
		ID = ID.toLowerCase();
		
		return (
			ID == text ||
			(includes == true   && ID.includes(text)) ||
			(startsWith == true && ID.startsWith(text)) ||
			(endsWith == true   && ID.endsWith(text))
		);
	});
}

async function run (containerSelector){
	const container = qs(containerSelector);
	const itemsNode = node.div;

	let searchValue = '';
	let boxes;
	let itemCount = node.div;

	const updateItems = () => {
		const items = findItems(searchValue, {
			includes: boxes.includes.checked,
			startsWith: boxes.startsWith.checked,
			endsWith: boxes.endsWith.checked,
		});

		itemCount.clear()(`Total Items Found: ${items.length}`);

		delayGenerateItems({
			container: itemsNode.clear(),
			items
		});
	}

	boxes = {
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
			}),
			itemCount
		),

		node.hr.class('w-80'),

		itemsNode
	);
}

export {
	run
};