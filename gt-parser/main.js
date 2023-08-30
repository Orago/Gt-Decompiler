import fs from 'fs';
import path from 'path';

class BinaryReader {
	constructor(buf) {
		this.buff = buf;
		this.index = 0;
	}
	read_short() {
		this.index += 2;

		return this.buff.readUInt16LE(this.index - 2);
	}
	read_int (l = 4) {
		this.index += l;

		return this.buff.readInt32LE(this.index - l);
	}
	read_char() {
		this.index++;
		return this.buff[this.index - 1];
	}
	read_str() {
		const len = this.buff.readUInt16LE(this.index);
		this.index += 2;
		
		const strBuf = this.buff.slice(this.index, this.index + len);
		this.index += len;
		
		return strBuf.toString();
	}
}

var SECRET = 'PBG892FXX982ABC*';

function xordec(ID, nlen, pos, enc, data) {
	let str = '';

	if (enc == true) 
		for (let i = 0; i < nlen; i++) {
			str += String.fromCharCode(data[pos]);
			pos += 1;
		}

	else
		for (let i = 0; i < nlen; i++) {
			str += String.fromCharCode(data[pos] ^ SECRET.charCodeAt((ID + i) % SECRET.length));
			pos += 1;
		}

	return str;
}

class GrowtopiaItem {
	#data = {};

	bind (key, value){
		Object.assign('')
	}

	get data (){
		return this.#data;
	}


}


const get_item = (r, itemsDat) => {
	const { version } = itemsDat;
	// const 

	let ID = r.read_int();
	let editableType = r.read_char();
	let itemCategory = r.read_char();
	let actionType = r.read_char();
	let hitsoundType = r.read_char();

	let nameLength = r.read_short();
	let name = xordec(ID,nameLength,r.index, false, r.buff);

	r.index += nameLength;

	let textureLength = r.read_short();
	let textureName = xordec(ID,textureLength,r.index, true, r.buff);

	r.index += textureLength;
	
	let textureHash = r.read_int();
	let itemKind = r.read_char();
	let val1 = r.read_int();
	let textureX = r.read_char();
	let textureY = r.read_char();
	let spreadType = r.read_char();
	let isStripeyWallpaper = r.read_char();
	let collisionType = r.read_char();
	let breakHits = r.read_char();
	let dropChance = r.read_int();
	let clothingType = r.read_char();
	let rarity = r.read_short();
	let maxAmount = r.read_char();
	
	var extraLength = r.read_short();
	var extraFile = xordec(ID,extraLength,r.index, true, r.buff);
	r.index += extraLength;

	var extraFileHash = r.read_int();
	var audioVolume = r.read_int();

	//#region //* Pet Data *//
	let petNameLength = r.read_short();
	let petName = xordec(ID,petNameLength,r.index, true, r.buff);

	r.index += petNameLength;

	let petPrefixLen = r.read_short();
	let petPrefix = xordec(ID,petPrefixLen,r.index, true, r.buff);

	r.index += petPrefixLen;

	let petSuffixLen = r.read_short()
	let petSuffix = xordec(ID,petSuffixLen,r.index, true, r.buff);

	r.index += petSuffixLen;

	let petAbilityLen = r.read_short();
	let petAbility = xordec(ID,petAbilityLen,r.index, true, r.buff);

	r.index += petAbilityLen;
	//#endregion //* Pet Data *//

	let seedBase = r.read_char();
	let seedOverlay = r.read_char();
	let treeBase = r.read_char();
	let treeLeaves = r.read_char();
	let seedColor = r.read_int();
	let seedOverlayColor = r.read_int();
	let unkval1 = r.read_int();
	

	let growTime = r.read_int();
	let val2 = r.read_short();
	let isRayman = r.read_short();

	let extraOptionsLen = r.read_short();
	let extraOptions = xordec(ID,extraOptionsLen,r.index, true, r.buff);
	r.index += extraOptionsLen;

	let texture2Length = r.read_short();
	let texture2 = xordec(ID,texture2Length,r.index, true, r.buff);
	r.index += texture2Length;

	let extraOptions2Length = r.read_short();
	let extraOptions2 = xordec(ID,extraOptions2Length,r.index, true, r.buff);
	r.index += extraOptions2Length;
	
	r.index += 80; //skiped many data
	
	let punchOptionsLen = r.read_short();
	let punchOptions = xordec(ID,punchOptionsLen,r.index, true, r.buff);


	

	if (version >= 11){
		r.index += punchOptionsLen;
	}

	if (version >= 12){
		r.read_int();
		r.read_int(9);
	}

	if (version >= 13){
		r.read_int();
	}

	if (version >= 14)
		r.read_int();

	if (version >= 15){
		r.read_int(25);
		r.read_str();
	}

	const itemData = {
		ID,
		name
	};

	const opts = {
		ID,
		name,
		editableType,
		itemCategory,
		actionType,
		hitsoundType,

		textureLength,
		textureName,
		textureHash,
		textureX,
		textureY,
		texture2,

		itemKind,
		spreadType,
		isStripeyWallpaper,
		collisionType,
		breakHits,
		dropChance,
		clothingType,
		rarity,
		maxAmount,
		audioVolume,
		
		petName,
		petPrefix,
		petSuffix,
		petAbility,

		seedBase,
		seedOverlay,
		seedColor,
		seedOverlayColor,

		treeBase,
		treeLeaves,

		growTime,
		isRayman,

		extraOptions,
		extraOptions2,
		punchOptions
	}

	for (const [key, value] of Object.entries(opts))
		if (value != '' && value != 0)
			itemData[key] = value;

	return itemData;
}

const parse = (directory = 'items.dat', requirement = () => true, resultData = item => item) => {
	let buffer;

	try      { buffer = fs.readFileSync(directory);   }
	catch(e) { return console.log('[Error]:', e.stack); }

	const r = new BinaryReader(buffer);

	const itemsDat = {
		version:   r.read_short(),
		itemCount: r.read_int(),
		items: {},
		dateGenerated: Date.now(),
		fileName: directory.substring(directory.lastIndexOf("/") + 1)
	}

	for (let i = 0; i < itemsDat.itemCount; i++){
		const item = get_item(r, itemsDat);

		if (!requirement(item, itemsDat)) continue;

		itemsDat.items[item.name] = resultData(item);
	}

	return itemsDat;
}

const _compare_items__handle = ([firstKeys, secondKeys], item_name) => {
	let mode = 0;

	if (!firstKeys.includes(item_name))
		mode = 1;

	if (!secondKeys.includes(item_name))
		mode = 2;

	return { mode };
}

const _compare_items__handle_return = (name, data) => data;

const compare_items = (firstFileName, secondFileName, handle_return = _compare_items__handle_return) => {
	if (firstFileName == null) return;
	if (secondFileName == null) return;

	const firstParsed = parse(firstFileName);
	const secondParsed = parse(secondFileName);
	const firstKeys = Object.keys(firstParsed.items);
	const secondKeys = Object.keys(secondParsed.items);
	
	const changedItems = [];
	const changedItemIDs = [];
	const changes = [];

	for (let [name, data] of Object.entries(secondParsed.items)){
		const { mode } = _compare_items__handle([firstKeys, secondKeys], name);
		if (mode == 0) continue;

		changedItems.push(
			handle_return(name, data).name
		);

		changedItemIDs.push(name);

		changes.push(`[+] ${secondParsed.fileName}: ${name}`);
	}

	for (let [name, data] of Object.entries(firstParsed.items)){
		if (changedItems.includes(name)) continue;

		const { mode } = _compare_items__handle([firstKeys, secondKeys], name);

		if (mode == 0 || changedItemIDs.includes(name))
			continue;

		changedItems.push(
			handle_return(name, data).name
		);

		changes.push(`[-] ${firstParsed.fileName}: ${name}`);
	}

	secondParsed.files = [firstParsed.fileName, secondParsed.fileName];

	delete secondParsed.fileName;
	delete secondParsed.items;
	
	secondParsed.changes = changes;
	secondParsed.newItemCount = changedItems.length;
	secondParsed.items = changedItems;

	return secondParsed;
}

const save = async (parsed, fileName = 'output/items.json') => {
	const dir = path.dirname(fileName);
	
	if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

	fs.writeFile(fileName, JSON.stringify(parsed, null, 2), (err) => { 
		if (err) console.log(err); 
		else console.log("File written successfully"); 
	});
}

export {
	parse,
	save,
	compare_items
};