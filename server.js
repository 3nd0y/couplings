/*
import express from 'express';
import path from 'path';
import csv from 'csv-parser';
import fs from 'fs';
<<<<<<< HEAD
import * as http from 'http';
import * as WebSocket from 'ws';

//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
=======
import {WebSocketServer} from 'ws';
*/
const express = require('express');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const {WebSocketServer} = require('ws');

var app = express();
const wss = new WebSocketServer({port:8081});
// const ws = new WebSocket({port:8080});

/*****************
 ps   = Pump Series Upper
 sd   = Shaft Diameter in Inch Upper
 ps2  = Pump Series bottom
 sd2  = Shaft Diameter in Inch bottom
 osize  = Oring size
 oaflas = Oring AFLAS PN
 ohsn = Oring HSN PN
 cpl  = Coupling PN
 css  = Carbon Steel Screw PN
 cslw = Carbon Steel Lock Washer
 ms   = Monel Screw
 mlw  = Monel Lock Washer
 sw   = Size in Wrench
 trq  = Torque Setting with Adapter Wrench (lbf-ft)
 *****************/
// const __dirname = path.resolve();


app.use(express.static(path.join(__dirname, 'www')));
console.log(path.join(__dirname, 'www'));
// app.use(express.static('www'));


app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'www/index.html'));
});
app.get('/coupling', function(req, res){
  // res.sendFile(path.join(__dirname, 'www/coupling-finder.html'));
  res.sendFile(path.join(__dirname, 'www/coupling.html'));
});

function find_cpl(ps, sd, ps2, sd2) {
  fs.createReadStream('data/extract_Table_connection.csv')
    .pipe(csv(['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq']))
    .on('data', (row) => {
      console.log(row.ps,':',row.ps2,':');
    if(row.ps==ps && row.sd==sd && row.ps2==ps2 && row.sd2==sd2) {
      console.log('Need coupling:\n' + row.cpl);
    }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });  
}

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    var dataj = JSON.parse(JSON.parse(data));
    // console.log("String: " + dataj.esp_upper);

    fs.createReadStream('data/extract_Table_connection.csv')
      .pipe(csv(['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq']))
      .on('data', (row) => {
        // console.log(row.ps,dataj.series_upper,':',row.sd,dataj.shft_upper,':',row.ps2,dataj.series_bottom,' ',row.sd2,dataj.shft_bottom);
        // console.log(row.ps==dataj.series_upper,row.sd==dataj.shft_upper,row.ps2==dataj.series_bottom,row.sd2==dataj.shft_bottom)
        if(row.ps==dataj.series_upper && row.sd==dataj.shft_upper && row.ps2==dataj.series_bottom && row.sd2==dataj.shft_bottom) {
          ws.send(row.cpl); 
        } else {
          ws.send('Wrong Choice');
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });  

  });

});

server.listen(process.env.PORT || 8080, function(){
  console.log('Server listening on port 8080');
});



// Example
// find_cpl('400 (FS) ','0.62','400','0.62');
