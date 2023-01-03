const { parse, save } = require('./gt-parser/main');

const parsed = parse(__dirname+'/itemsnew.dat');


save(parsed, 'output/all_items.json');