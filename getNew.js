const { save, compare_items } = require('./gt-parser/main');

const newParsed = compare_items('versions/3_2_2023.dat', 'versions/4_3_2023.dat');

save(newParsed);