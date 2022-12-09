# full print all data
# remaked by iFanpS; helped by KIPAS (alot of help)
import struct
SECRET = "PBG892FXX982ABC*"


class itemDat:
	def __init__(self):
		self.version = -1
		self.itemCount = -1


class Item:
  def __init__(self):
    self.ID = -1
    self.name = "Unset Name"
    self.editableType = None
    self.category = None
    self.actionType = None
    self.hitSoundType = None
    self.texture = -1
    self.textureHash = None
    self.itemKind = None
    self.val1 = None
    self.textureX = None
    self.textureY = None
    self.spreadType = None
    self.isStripeyWallpaper = None
    self.collisionType = None
    self.breakHits = None
    self.dropChance = None
    self.clothingType = None
    self.rarity = None
    self.audioVolume = None
    self.petName = None
    self.petPrefix = None
    self.petSuffix = None
    self.petAbility = None
    self.seedBase = None
    self.seedOverlay = None




def memcpy(id, nlen, pos, enc, data):
  str = ''
  if enc == True:
      for i in range(nlen):
        str += chr(data[pos])
        pos += 1
  else:
      for i in range(nlen):
        str += chr(data[pos] ^ ord(SECRET[(id + i) % len(SECRET)]))
        pos += 1
  return str

def decFile(data):
    newItemDat = itemDat()

    memPos = 0

    newItemDat.version   = struct.unpack('<H', data[memPos:memPos+2])[0]; memPos += 2;
    newItemDat.itemCount = struct.unpack('i', data[memPos:memPos+4])[0]; memPos += 4;
		
    for i in range(newItemDat.itemCount):
      item = Item()
      
      itemID = struct.unpack('i', data[memPos:memPos+4])[0]; memPos += 4
      item.editableType = data[memPos]; memPos += 1
      item.category = data[memPos]; memPos += 1
      item.actionType   = data[memPos]; memPos += 1
      item.hitSoundType = data[memPos]; memPos += 1

      #region name parse
      strLen = data[memPos] + data[memPos + 1] * 256; memPos += 2
      item.name = memcpy(itemID, strLen, memPos, False, data)
      memPos += strLen
      #endregion name parse end

      #region texture parse
      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      item.texture = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen
      #endregion texture parse

      #region texturehash parse
      item.textureHash = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      #region itemKind
      item.itemKind = data[memPos]
      memPos += 1
      #endregion end

      #region val1 parse
      item.val1 = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      #region textureX & textureY
      item.textureX = data[memPos]
      item.textureY = data[memPos]
      memPos += 2
      #endregion end

      #region spreadType
      item.spreadType = data[memPos]
      memPos += 1
      #endregion end

      #region stripeywallpaper
      item.isStripeyWallpaper = data[memPos]
      memPos += 1
      #endregion end

      #region Collision
      item.collisionType = data[memPos]
      memPos += 1
      #endregion end

      #region breakHits
      item.breakHits = data[memPos]
      memPos += 1
      #endregion end

      #region dropChance
      dropChance = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      #region clothingType
      clothingType = data[memPos]
      memPos += 1
      #endregion end

      #region rarity
      rarity = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 2
      #endregion end

      #region maxAmount
      maxAmount = data[memPos]
      memPos += 1
      #endregion end

      #region extrFile parse
      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      extraFile = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen
      #endregion extraFile parse

      #region extraFilehash
      extraFilehash = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      #region audioVolume
      audioVolume = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      #region pet option
      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      petName = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen

      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      petPrefix = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen

      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      petSuffix = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen

      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      petAbillity = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen
      #endregion pet option

      #region seed(base,overlay)
      seedBase = data[memPos]
      seedOverlay = data[memPos]
      memPos += 2
      #endregion end

      #region tree(base,leaves)
      treeLeaves = data[memPos]
      treeBase = data[memPos]
      memPos += 2
      #endregion end

      #region seed(color,overlaycolor)
      seedColor = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      seedOverlayColor = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      memPos += 4  # deleted ingridients

      #region growTime
      growTime = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 4
      #endregion end

      #region val2 & isRayman
      val2 = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 2
      isRayman = struct.unpack('i', data[memPos:memPos+4])[0]
      memPos += 2
      #endregion end

      # item extra data
      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      extraOptions = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen

      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      texture2 = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen

      strLen = data[memPos] + data[memPos + 1] * 256
      memPos += 2
      extraOptions2 = memcpy(itemID, strLen, memPos, True, data)
      memPos += strLen

      # item extra data

      memPos += 80  # unknown data

      if (newItemDat.version >= 11):
          strLen = data[memPos] + data[memPos + 1] * 256
          memPos += 2
          punchOptions = memcpy(itemID, strLen, memPos, True, data)
          memPos += strLen

          if (newItemDat.version >= 12):
              memPos += 13
# skip data

      if (newItemDat.version >= 13):
          memPos += 4
# skip data

      if (newItemDat.version >= 14):
          memPos += 4  # skip data

# print what you want here
      if i != itemID:
          print('Unordered item ' + str(itemID)  + '/' + str(itemCount))