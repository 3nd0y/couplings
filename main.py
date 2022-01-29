import csv
import asyncio
import websockets

# ps		= Pump Series Upper
# sd		= Shaft Diameter in Inch Upper
# ps2		= Pump Series bottom
# sd2		= Shaft Diameter in Inch bottom
# osize		= Oring size
# oaflas	= Oring AFLAS PN
# ohsn		= Oring HSN PN
# cpl		= Coupling PN
# css		= Carbon Steel Screw PN
# cslw		= Carbon Steel Lock Washer
# ms		= Monel Screw
# mlw		= Monel Lock Washer
# sw		= Size in Wrench
# trq		= Torque Setting with Adapter Wrench (lbf-ft)

async def echo(websocket):
    async for message in websocket:
        await websocket.send(message)

async def main():
    async with websockets.serve(echo, "localhost", 8080):
        await asyncio.Future()  # run forever

asyncio.run(main())

def search(ps, sd, ps2, sd2):
	with open('www/files/extract_Table_connection.csv') as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=',')
		line_count = 0
		for row in csv_reader:
			if(row[0]==ps and row[1]==sd and row[2]==ps2 and row[3]==sd2):
				# print 'Coupling:\n',row[7] ## python 2.7 style
				print('Coupling:\n',row[7])

search('400 (FS) ','0.62','400','0.62')