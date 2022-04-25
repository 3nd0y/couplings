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
	// console.log(dataj);
	if (dataj.esp_upper == 'u_pump' && dataj.esp_bottom == 'b_pump') {
		console.log('PUMP to PUMP');
		fs.createReadStream('data/pump-pump.csv')
		  .pipe(csv(['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq']))
		  .on('data', (row) => {
			// console.log(row.ps,dataj.series_upper,':',row.sd,dataj.shft_upper,':',row.ps2,dataj.series_bottom,' ',row.sd2,dataj.shft_bottom);
			// console.log(row.ps==dataj.series_upper,row.sd==dataj.shft_upper,row.ps2==dataj.series_bottom,row.sd2==dataj.shft_bottom)
			if(row.ps==dataj.series_upper && row.sd==dataj.shft_upper && row.ps2==dataj.series_bottom && row.sd2==dataj.shft_bottom) {
			  ws.send(row.cpl); 
			}
		  })
		  .on('end', () => {
			// console.log('CSV file successfully processed');
		  });  

	} else if (dataj.esp_upper == 'u_pump' && dataj.esp_bottom == 'b_agh') {
		console.log('PUMP to AGH');
	} else if (dataj.esp_upper == 'u_agh' && dataj.esp_bottom == 'b_intake') {
		console.log('AGH to INTAKE');
	} else if ((dataj.esp_upper == 'u_pump' || 
				dataj.esp_upper == 'b_agh') && dataj.esp_bottom == 'b_protector') {
		console.log('PUMP or AGH/MGH to Protector');
	} else if (dataj.esp_upper == 'u_pump' && dataj.esp_bottom == 'b_intake') {
		console.log('PUMP to INTAKE');
	} else if (dataj.esp_upper == 'u_intake' && dataj.esp_bottom == 'b_protector') {
		console.log('INTAKE to PROTECTOR');
	} else if (dataj.esp_upper == 'u_protector' && dataj.esp_bottom == 'b_protector') {
		console.log('PROTECTOR to PROTECTOR');
	} else if (dataj.esp_upper == 'u_protector' && dataj.esp_bottom == 'b_motor') {
		console.log('PROTECTOR to MOTOR');
	} else if (dataj.esp_upper == 'u_motor' && dataj.esp_bottom == 'b_motor') {
		console.log('MOTOR to MOTOR');
	} else if ((dataj.esp_upper == 'u_pump' ||
				dataj.esp_upper == 'u_agh' ||
				dataj.esp_upper == 'u_intake') && dataj.esp_bottom == 'b_maxProtector') {
		console.log('AGH/INTAKE/PUMP to PROTECTOR MAXIMUS');
	} else if (dataj.esp_upper == 'u_maxProtector' && dataj.esp_bottom == 'b_maxProtector') {
		console.log('MAXIMUS PROTECTOR to MAXIMUS PROTECTOR');
	} else if (dataj.esp_upper == 'u_maxProtector' && (dataj.esp_bottom == 'b_motor' || dataj.esp_bottom == 'b_maxMotor')) {
		console.log('MAXIMUS PROTECTOR to MOTOR/MAXIMUS MOTOR');
	} else if (dataj.esp_upper == 'u_maxMotor' && dataj.esp_bottom == 'b_maxMotor') {
		console.log('MAXIMUS MOTOR to MAXIMUS MOTOR');
	} else {
		console.log('Not Recognized');
	}

  });

});