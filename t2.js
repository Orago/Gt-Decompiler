class Item {
    constructor() {
        this._M_Id = 0;
        this._M_Editable_Type = 0;
        this._M_Item_Category = 0;
        this._M_Action_Type = 0;
        this._M_Hit_Sound_Type = 0;
        this._M_Name = "";
        this._M_Texture_Path = "";
        this._M_Texture_Hash = 0;
        this._M_Item_Kind = 0;
        this._M_Flags1 = 0;
        this._M_Ingredient = 0;
        this._M_Texture_X = 0;
        this._M_Texture_Y = 0;
        this._M_Spread_Type = 0;
        this._M_Is_Stripey_Wallpaper = 0;
        this._M_Collision_Type = 0;
        this._M_Break_Hits = 0;
        this._M_Reset_Time = 0;
        this._M_Grow_Time = 0;
        this._M_Clothing_Type = 0;
        this._M_Rarity = 0;
        this._M_Max_Amount = 0;
        this._M_Extra_File = "";
        this._M_Extra_File_Hash = 0;
        this._M_Audio_Volume = 0;
        this._M_Pet_Name = "";
        this._M_Pet_Prefix = "";
        this._M_Pet_Suffix = "";
        this._M_Pet_Ability = "";
        this._M_Seed_Base = 0;
        this._M_Seed_Overlay = 0;
        this._M_Tree_Base = 0;
        this._M_Tree_Leaves = 0;
        this._M_Seed_Color = 0;
        this._M_Seed_Overlay_Color = 0;
        this._M_Flags2 = 0;
        this._M_Rayman = 0;
        this._M_Extra_Options = "";
        this._M_Texture2_Path = "";
        this._M_Extra_Options2 = "";
        this._M_Punch_Options = "";
        this._M_Unk_Data1 = new Uint8Array(80);
        this._M_Unk_Data1.fill(0);
        this._M_Unk_Data2 = new Uint8Array(25);
        this._M_Unk_Data2.fill(0);
        this._M_Flags3 = 0;
        this._M_Flags4 = 0;
        this._M_Flags5 = 0;
        this._M_Bodypart = new Uint8Array(9);
        this._M_Bodypart.fill(0);
        this._M_Texture3_Path = "";
        this._M_Texture3_Hash = 0;
    }
}

const items = []; 