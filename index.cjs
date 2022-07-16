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
  .get(INDEX, function(req, res){
     res.sendFile(path.join(__dirname, 'www/coupling.html'))
   })
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

// Variable
const type = {
    u_maximus:[
        '',
        'AGH LT (FS) Ext Hd ',
        'AGH LT Ext Hd ',
        'AGH LT (FS) ',
        'AGH LT ',
        'Intake ',
        'Intake (FS) ',
        'Intake Ext Hd ',
        'Intake (FS) Ext Hd ',
        'Intake Ext Hd (FS) ',
        'Gas Separator ',
        'Gas Separator (FS) ',
        'Gas Separator Ext Hd ',
        'Gas Separator Ext Hd (FS) ',
        'MGH LT Ext Hd ',
        'MGH LT ',
        'Pump LT Ext Hd ',
        'Pump LT (FS) Ext Hd ',
        'Pump LT ',
        'Pump LT (FS) ',
        'Pump S ',
        'Pump S/LT ',
        'Maximus Protector (FS) MaxJoint ',
        'Maximus Protector UT (FS) MaxJoint ',
        'Maximus Protector S/LT (FS) MaxJoint ',
        'Maximus Protector S (FS) MaxJoint ',
        'ProMotor UT ',
        'Maximus Motor UT ',
        'Maximus Motor CT '
    ],
    val_u_maximus:[
        '',
        'agh_lt_fs_ext_hd',
        'agh_lt_ext_hd',
        'agh_lt_fs',
        'agh_lt',
        'intake',
        'intake_fs',
        'intake_ext_hd',
        'intake_fs_ext_hd',
        'intake_fs_ext_hd_fs',
        'gs ',
        'gs_fs ',
        'gs_ext_hd ',
        'gs_ext_hd_fs ',
        'mgh_lt_ext_hd',
        'mgh_lt',
        'pump_lt_ext_hd',
        'pump_lt_ext_hd_fs',
        'pump_lt',
        'pump_lt_fs',
        'pump_s',
        'pump_s_lt',
        'max_pro_fs_maxj',
        'max_pro_ut_fs_maxj',
        'max_pro_slt_fs_maxj',
        'max_pro_s_fs_maxj',
        'promotor_ut',
        'max_motor_ut',
        'max_motor_ct'
    ],
    b_maximus:[
        '',
        'Maximus Protector (FS) MaxJoint ',
        'Maximus Protector UT (FS) MaxJoint ',
        'Maximus Protector S/LT (FS) MaxJoint ',
        'Maximus ProMotor S & UT (FS) MaxJoint ',
        'Maximus Motor S/UT ',
        'Motor UT ',
        'Motor S/UT ',
        'Dominator Motor S/UT ',
        'Motor LT Maximus ',
        'Maximus Motor CT or LT',
    ],
    val_b_maximus:[
        '',
        'max_pro_fs_maxj',
        'max_pro_ut_fs_maxj',
        'max_pro_s_lt_fs_maxj',
        'max_promotor_s_ut_fs_maxj',
        'max_motor_s_ut',
        'motor_ut',
        'motor_s_ut',
        'dom_motor_sut',
        'motor_lt_max',
        'max_motor_ct_lt'
    ]
}

const pump_agh_intake_tomaxprot={
	u:[
    'agh_lt_fs_ext_hd',
    'agh_lt_ext_hd',
    'agh_lt_fs',
    'agh_lt',
    'intake',
    'intake_fs',
    'intake_ext_hd',
    'intake_fs_ext_hd',
    'intake_fs_ext_hd_fs',
    'gs ',
    'gs_fs ',
    'gs_ext_hd ',
    'gs_ext_hd_fs ',
    'mgh_lt_ext_hd',
    'mgh_lt',
    'pump_lt_ext_hd',
    'pump_lt_ext_hd_fs',
    'pump_lt',
    'pump_lt_fs',
    'pump_s',
    'pump_s_lt'
	],
	b:[
		'max_pro_fs_maxj',
    'max_pro_ut_fs_maxj',
    'max_pro_s_lt_fs_maxj',
    'max_pro_s_fs_maxj',
    'max_promotor_s_ut_fs_maxj'
	]
}


const maxprotector_tomaxprot={
    u:[
        'max_pro_fs_maxj',
        'max_pro_ut_fs_maxj'
    ],
    b:[
        'max_pro_fs_maxj',
        'max_pro_ut_fs_maxj',
        'max_pro_s_lt_fs_maxj',
    ]
}


const maxprotector_tomaxmotdom={
    u:[
        'max_pro_fs_maxj',
        'max_pro_ut_fs_maxj',
        'max_pro_s_lt_fs_maxj',
        'max_pro_s_fs_maxj'
    ],
    b:[
        'motor_ut',
        'motor_s_ut',
        'dom_motor_sut',
    ]
}

const maxmotr_tomaxmot={
    u:[
    	'promotor_ut',
        'max_motor_ut',
        'max_motor_ct'
    ],
    b:[
        'motor_lt_max',
        'max_motor_ct_lt'
    ]
}

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    var dataj = JSON.parse(JSON.parse(data));
    var esp_type;
    var table_list;
    var status_filter=true;
    var maximus=dataj.maxornot;
    console.log('===============');
	console.log(dataj);
	
	// console.log(pump_agh_intake_tomaxprot.u.includes(dataj.esp_upper),pump_agh_intake_tomaxprot.b.includes(dataj.esp_bottom));
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
		} else if (pump_agh_intake_tomaxprot.u.includes(dataj.esp_upper)&&pump_agh_intake_tomaxprot.b.includes(dataj.esp_bottom)){
			console.log('AGH/INTAKE/PUMP LT to PROTECTOR MAXIMUS');
			esp_type='data/mgh_agh_intake_pump_LT-Max_prot_promotor.csv';
			table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
		} else if(maxprotector_tomaxprot.u.includes(dataj.esp_upper)&&pump_agh_intake_tomaxprot.b.includes(dataj.esp_bottom)) {
			console.log('PROTECTOR MAXIMUS TO PROTECTOR MAXIMUS PROMOTOR');
			esp_type='data/maxProtector-maxProtector_promotor.csv';
			table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
		} else if(maxprotector_tomaxmotdom.u.includes(dataj.esp_upper)&&maxprotector_tomaxmotdom.b.includes(dataj.esp_bottom)) {
			console.log('PROTECTOR MAXIMUS TO MOTOR DOMINATOR MAXIMUS PROMOTOR');
			esp_type='data/maxProtector-std_motor_dominator_max_motor.csv';
			table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
		} else if(maxmotr_tomaxmot.u.includes(dataj.esp_upper)&&maxmotr_tomaxmot.b.includes(dataj.esp_bottom)) {
			console.log('MOTOR MAXIMUS TO DOMINATOR MAXIMUS PROMOTOR');
			esp_type='data/maxUT_motor_promotor-maxCT_LT_motor.csv';
			table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
		}
		else {
			console.log('mismatch error');
			console.log(maxmotr_tomaxmot.u);
			console.log(dataj.esp_upper);
			console.log(maxmotr_tomaxmot.b);
			console.log(dataj.esp_bottom);
			status_filter=false;
		}

		console.log('esp_type: '+esp_type,'\ntable_list: '+table_list)+'\n\n';
		if(status_filter){
			fs.createReadStream(esp_type)
		  .pipe(csv(table_list))
		  .on('data', (row) => {
		  	// console.log(row);
			// console.log(row.ps,dataj.series_upper,':',row.sd,dataj.shft_upper,':','\"'+row.ps2+'\"','\"'+dataj.series_bottom+'\"',':','\"'+row.sd2+'\"','\"'+dataj.shft_bottom+'\"');
			// console.log(row.ps==dataj.series_upper,row.sd==dataj.shft_upper,row.ps2==dataj.series_bottom,row.sd2==dataj.shft_bottom)
			
			if(!maximus){
				if(row.ps==dataj.series_upper && row.sd==dataj.shft_upper && row.ps2==dataj.series_bottom && row.sd2==dataj.shft_bottom) {
				  ws.send(row.cpl); 
				  // var results=[];
				  // results.push(row);
				  // console.log('Non Max send:\n'+JSON.stringify(results));
				}
			} else {
				for (var a in type.val_u_maximus) {
					if(dataj.esp_upper==type.val_u_maximus[a]) dataj.esp_upper = type.u_maximus[a];
					if(dataj.esp_bottom==type.val_b_maximus[a]) dataj.esp_bottom = type.b_maximus[a];
				}
				if(row.ps==dataj.series_upper && row.sd==dataj.shft_upper && row.ps2==dataj.series_bottom && row.sd2==dataj.shft_bottom && row.sname==dataj.esp_upper && row.sname2==dataj.esp_bottom) {
				  ws.send(row.cpl); 
				  // var results=[];
				  // results.push(row);
				  // console.log('Max send:\n'+JSON.stringify(results));

				}
			}
		  })
		  .on('end', () => {
			// console.log();
		  });
		}
		  
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



