'use strict';

const express = require('express');
const { Server } = require('ws');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const PORT = process.env.PORT || 3000;
const INDEX = '/coupling.html';

const server = express()
  .use(express.static(path.join(__dirname, 'www')))
  .get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'www/index.html'))
  })
  .get('/coupling', function(req, res){
     res.sendFile(path.join(__dirname, 'www/coupling.html'))
   })
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    var dataj = JSON.parse(JSON.parse(data));
    fs.createReadStream('data/extract_Table_connection.csv')
      .pipe(csv(['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq']))
      .on('data', (row) => {
        // console.log(row.ps,dataj.series_upper,':',row.sd,dataj.shft_upper,':',row.ps2,dataj.series_bottom,' ',row.sd2,dataj.shft_bottom);
        // console.log(row.ps==dataj.series_upper,row.sd==dataj.shft_upper,row.ps2==dataj.series_bottom,row.sd2==dataj.shft_bottom)
        if(row.ps==dataj.series_upper && row.sd==dataj.shft_upper && row.ps2==dataj.series_bottom && row.sd2==dataj.shft_bottom) {
          ws.send(row.cpl); 
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });  

  });

});