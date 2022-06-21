'use strict';

const express = require('express');
const { Server } = require('ws');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const PORT = process.env.PORT || 3000;
const INDEX = '/coupling';

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
    var esp_type;
    var table_list;
	// console.log(dataj);
		if (dataj.esp_upper == 'u_pump' && dataj.esp_bottom == 'b_pump') {
			console.log('PUMP to PUMP');
			esp_type='data/pump-pump.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_pump' && dataj.esp_bottom == 'b_agh') {
			console.log('PUMP to AGH/MGH');
			esp_type='data/pump-agh_mgh.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_agh' && dataj.esp_bottom == 'b_intake') {
			console.log('AGH to INTAKE');
			esp_type='data/aghmgh-intake.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
		} else if ((dataj.esp_upper == 'u_pump' || dataj.esp_upper == 'b_agh') && dataj.esp_bottom == 'b_protector') {
			console.log('PUMP or AGH/MGH to Protector');
			esp_type='data/pump_agh_mgh-protector.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_pump' && dataj.esp_bottom == 'b_intake') {
			console.log('PUMP to INTAKE');
			esp_type='data/pump-intake.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_intake' && dataj.esp_bottom == 'b_protector') {
			console.log('INTAKE to PROTECTOR');
			esp_type='data/intake-protector.csv';
			table_list=['ps','sd','ps2','sd2','osize','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_protector' && dataj.esp_bottom == 'b_protector') {
			console.log('PROTECTOR to PROTECTOR');
			esp_type='data/protector-protector.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_protector' && dataj.esp_bottom == 'b_motor') {
			console.log('PROTECTOR to MOTOR');
			esp_type='data/protector-motor.csv';
			table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','sa','css','cslw','rfa','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_motor' && dataj.esp_bottom == 'b_motor') {
			console.log('MOTOR to MOTOR');
			esp_type='data/motor-motor.csv';
		} else if ((dataj.esp_upper == 'u_pump' ||
					dataj.esp_upper == 'u_agh' ||
					dataj.esp_upper == 'u_intake') && dataj.esp_bottom == 'b_maxProtector') {
			console.log('AGH/INTAKE/PUMP LT to PROTECTOR MAXIMUS'); // This will pass for this momment
		} else if (dataj.esp_upper == 'u_maxProtector' && dataj.esp_bottom == 'b_maxProtector') {
			console.log('MAXIMUS PROTECTOR to MAXIMUS PROTECTOR');
			esp_type='data/maxProtector-maxProtector_promotor.csv';
			table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
		} else if (dataj.esp_upper == 'u_maxProtector' && (dataj.esp_bottom == 'b_motor' || dataj.esp_bottom == 'b_maxMotor')) {
			console.log('MAXIMUS PROTECTOR to MOTOR/MAXIMUS MOTOR');
			esp_type='data/maxProtector-std_motor_dominator_max_motor.csv'
		} else if (dataj.esp_upper == 'u_maxMotor' && dataj.esp_bottom == 'b_maxMotor') {
			console.log('MAXIMUS MOTOR to MAXIMUS MOTOR');
			esp_type='maxUT_motor_promotor-maxCT_LT_motor.csv'
			table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
		} else {
			console.log('Not Recognized');
		}
		fs.createReadStream(esp_type)
		  .pipe(csv(table_list))
		  .on('data', (row) => {
			// console.log(row.ps,dataj.series_upper,':',row.sd,dataj.shft_upper,':','\"'+row.ps2+'\"','\"'+dataj.series_bottom+'\"',':','\"'+row.sd2+'\"','\"'+dataj.shft_bottom+'\"');
			// console.log(row.ps==dataj.series_upper,row.sd==dataj.shft_upper,row.ps2==dataj.series_bottom,row.sd2==dataj.shft_bottom)
				if(row.ps==dataj.series_upper && row.sd==dataj.shft_upper && row.ps2==dataj.series_bottom && row.sd2==dataj.shft_bottom) {
				  ws.send(row.cpl); 
				}
		  })
		  .on('end', () => {
			// console.log();
		  });  
	});

});


/*************
Appendix
dataj = data JSON from Websocket
row = data from CSV 
series_upper = 338-1000
shft_upper = 0.62-1.18
series_bottom = 338-1000
shft_bottom = 0.62-1.18


ps = string upper
sd = shaft diameter upper
ps2 = string bottom
sd2 = shaft diameter bottom
osize = oring size
oaflas = oring aflas p/n
ohsn = oring hsn p/n
cpl = coupling monel p/n
cpl_inc625 = coupling INC 625 p/n
cpl_inc718 = coupling INC 718 p/n
csfa = CS Flange Adapter
css = cs screw
cslw = cs lockwasher
rfa = rloy flange adapter
ms = monel washer
mlw = monel lockwasher
sw = wrench size
trq = torques bolt setting
**************/