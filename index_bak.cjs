const express = require('express');
const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');
const { Server } = require('ws');

//initialize a simple http server
// const server = http.createServer(app);


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
const app = express()
          .use(express.static(path.join(__dirname, 'www')))
          .get('/', function(req, res){
            res.sendFile(path.join(__dirname, 'www/index.html'));
          })
          .get('/coupling', function(req, res){
            res.sendFile(path.join(__dirname, 'www/coupling-finder.html'));
          })
          .listen(process.env.PORT || 8080, function(){
            console.log('Server listening on port 8080');
          });

//initialize the WebSocket server instance
const wss = new WebSocketServer({ 
	app
});

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    // console.log('received: %s', data);
    var dataj = JSON.parse(JSON.parse(data));
    console.log("String: " + dataj.esp_upper);
  });
});