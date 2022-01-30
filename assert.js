import assert from 'assert';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
var parser = parse({columns: true}, function (err, records) {
  // console.log(records);
});

fs.createReadStream(__dirname+'/data/extract_Table_connection.csv').pipe(parser);

parser.on('readable', function(err,rec){
 console.log(err);
});

parser.on('error', function(err){
  console.error(err.message);
});