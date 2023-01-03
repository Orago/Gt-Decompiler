const fs = require("fs");
class BinaryReader {
	constructor(buf) {
		this.buff = buf;
		this.index = 0;
	}
	read_short() {
		const val = this.buff.readUInt16LE(this.index);
		this.index += 2;
		return val;
	}
	read_int() {
		const val = this.buff.readInt32LE(this.index);
		this.index += 4;
		return val;
	}
    read_char() {
    	const val = this.buff[this.index];
      this.index++;
    	return val;
    }
}
var SECRET = "PBG892FXX982ABC*"
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


const get_item = r => {
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

	r.index += punchOptionsLen;
	r.index += 13 + 8;

	return {
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
}

const parse = (fileName = 'items.dat') => {
	let buffer;

	try      { buffer = fs.readFileSync(fileName);   }
	catch(e) { return console.log('[Error]:', e.stack); }

	const r = new BinaryReader(buffer);

	const itemsDat = {
		version:   r.read_short(),
		itemCount: r.read_int(),
		items: {}
	}

	for (let i = 0; i < itemsDat.itemCount; i++){
		let item = get_item(r);

		itemsDat.items[item.name] = item;
	}

	return itemsDat;
}

const save = (fileName = 'items.json', parsed) => 
	fs.writeFile(fileName, JSON.stringify(parsed, null, 2), (err) => { 
		if (err) console.log(err); 
		else console.log("File written successfully"); 
	});

doWithParsed: {
	const oldParsed = parse('itemsnew.dat');
	const parsed = parse('items.dat');

	const differentItems = [];

	for (let name of Object.keys(parsed.items)){
		if (oldParsed.items[name] == undefined)
			differentItems.push( parsed.items[name].name );
	}

	delete parsed.items;
	parsed.newItemCount = differentItems.length;
	parsed.items = differentItems;
	
	save('newItems.json', parsed);
}