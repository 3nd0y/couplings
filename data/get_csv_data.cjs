'use strict';

const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

let table_list;
let datafile;


// const cek="pump-pump";
// const cek="pump-agh_mgh";
// const cek="aghmgh-intake";
// const cek="pump_agh-protector";
// const cek="pump-intake";
// const cek="intake-protector";
// const cek="protector-protector";
// const cek="protector-motor";
// const cek="motor-motor";
// const cek="maxProtector-maxProtector_promotor";
// const cek="maxProtector-std_motor_dominator_max_motor";
// const cek="maxUT_motor_promotor-maxCT_LT_motor";
const cek="mgh_agh_intake_pump_LT-Max_prot_promotor";


console.log('\n\n**'+cek+'**\n\n');
if(cek=='pump-pump') {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq'];
	datafile='../data/pump-pump.csv';
} else if (cek=='pump-agh_mgh') {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];	
	datafile='../data/pump-agh_mgh.csv';
} else if (cek=='aghmgh-intake') {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','cpl','css','cslw','ms','mlw','sw','trq'];	
	datafile='../data/aghmgh-intake.csv';
} else if(cek=="pump_agh-protector") {
	table_list=['ps','sd','ps2','sd2','osize','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
	datafile='../data/pump_agh_mgh-protector.csv';
} else if (cek=="pump-intake") {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
	datafile='../data/pump-intake.csv';
} else if (cek=='intake-protector') {
	table_list=['ps','sd','ps2','sd2','osize','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
	datafile='../data/intake-protector.csv';
} else if (cek=='protector-protector') {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
	datafile='../data/protector-protector.csv';
} else if (cek=='protector-motor') {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','sa','css','cslw','rfa','ms','mlw','sw','trq'];
	datafile='../data/protector-motor.csv';
} else if (cek=='motor-motor') {
	table_list=['ps','sd','ps2','sd2','osize','oaflas','ohsn','csfa','cpl','css','cslw','rfa','ms','mlw','sw','trq'];
	datafile='../data/motor-motor.csv';
} else if (cek=='maxProtector-maxProtector_promotor') {
	table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
	datafile='../data/maxProtector-maxProtector_promotor.csv';
} else if(cek=='maxProtector-std_motor_dominator_max_motor') {
	table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
	datafile='../data/maxProtector-std_motor_dominator_max_motor.csv';
} else if(cek=='maxUT_motor_promotor-maxCT_LT_motor') {
	table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
	datafile='../data/maxUT_motor_promotor-maxCT_LT_motor.csv';
} else if(cek=='mgh_agh_intake_pump_LT-Max_prot_promotor') {
	table_list=['sname','ps','sd','sname2','ps2','sd2','cpl','cpl_inc625','cpl_inc718','sa','csfa','rfa','osize','oaflas','ohsn','css','cslw','ms','mlw','sw','trq'];
	datafile='../data/mgh_agh_intake_pump_LT-Max_prot_promotor.csv';
}
let results = [];
let z = [];
let flag;

fs.createReadStream(datafile)
  .pipe(csv(table_list))
  .on('data', (row) => {
  	results.push(row);
  }).on('end', () => {
  	// console.log(results[0].sname);

/*
  	console.log("===PS===\n\[");
  	for(let n in results) {
  		flag=false;
  		for(let x in z){
			if(z[x].ps==results[n].ps) flag=true;
		}
		if(!flag) {
			console.log('\t\''+results[n].ps+'\',');
			z[n]=results[n];
		}
  	}
  	console.log('\]');

  	z=[];
	console.log("\n===PS2===\n\[");
	for(let n in results) {
  		flag=false;
  		for(let x in z){
			if(z[x].ps2==results[n].ps2) flag=true;
		}
		if(!flag) {
			console.log('\t\''+results[n].ps2+'\',');
			z[n]=results[n];
		}
  	}
  	console.log('\]');

  	z=[];
	console.log("\n===SD===\n\[");
	for(let n in results) {
  		flag=false;
  		for(let x in z){
			if(z[x].sd==results[n].sd) flag=true;
		}
		if(!flag) {
			console.log('\t\''+results[n].sd+'\',');
			z[n]=results[n];
		}
  	}
  	console.log('\]');


  	z=[];
	console.log("\n===SD2===\n\[");
	for(let n in results) {
  		flag=false;
  		for(let x in z){
			if(z[x].sd2==results[n].sd2) flag=true;
		}
		if(!flag) {
			console.log('\t\''+results[n].sd2+'\',');
			z[n]=results[n];
		}
  	}
  	console.log('\]');
*/
  	z=[];
 	console.log("\n===Sname===\n\[");
	for(let n in results) {
  		flag=false;
  		for(let x in z){
			if(z[x].sname==results[n].sname) flag=true;
		}
		if(!flag) {
			console.log('\t\''+results[n].sname+'\',');
			z[n]=results[n];
		}
  	}
  	console.log('\]');

  	z=[];
  console.log("\n===Sname2===\n\[");
	for(let n in results) {
  		flag=false;
  		for(let x in z){
			if(z[x].sname2==results[n].sname2) flag=true;
		}
		if(!flag) {
			console.log('\t\''+results[n].sname2+'\',');
			z[n]=results[n];
		}
  	}
  	console.log('\]');

  });  
