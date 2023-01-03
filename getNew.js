const { parse, save, compare_items } = require('./gt-parser/main');

const newParsed = compare_items('versions/12_30_2022.dat', 'versions/items.dat');

save(newParsed);