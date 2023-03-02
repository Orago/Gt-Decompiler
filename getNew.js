const { parse, save, compare_items } = require('./gt-parser/main');

const newParsed = compare_items('versions/2_24_2023.dat', 'versions/items.dat');

save(newParsed);