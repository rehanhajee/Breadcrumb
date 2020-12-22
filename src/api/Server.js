let net = require("net");
let fs = require("fs");

const PORT = 3080;
const DIR_PATH = "/";

var localDir = "";

let date = new Date().toString();

console.log("Starting server...");

net.createServer((socket) => {
	
	socket.on("end", () => {
		console.log("Connection terminated.\r\n\r\n");
	})
	
	socket.on("data", (data) => {
		try {
			processInput(data.toString(), socket);
		} catch (e) {
			console.log(e);
		}
	})
	
}).on("connection", (data) => {
	console.log("Connection established!");	
}).on("error", (err) => {
	console.error(err);
}).listen(PORT, () => {
	console.log("Listening on port: " + PORT);
});


function processInput(inputStr, socket) {
	console.log(inputStr);
	
	let request = inputStr.split("\r\n");
	let httpRequest = request[0].trim().split(" ");
	
	localDir = httpRequest[1];
	
	fs.stat(DIR_PATH + localDir, (err, stats) => { 
		if( !err ) { 
			if(stats.isFile()){
				getFileContent(socket);
			} else if(stats.isDirectory()){ 
				getFiles(socket); 
			} 
		} else
			throw err;  
	}); 
	
}

function getFileContent(socket) {
	let response = "";
	let responseLength = 0;
	
	let fileName = localDir.split("/");
	fileName = fileName[fileName.length - 1];
	responseLength = 53 + fileName.length + localDir.length;
	response = "HTTP/1.1 200 OK\nContent-Length: " + responseLength + "\nServer: localhost\nConnection: close\nContent-Type: text/html; charset=utf-8\nDate: " + date.split(" (")[0] + "\nContent-Language: en-us\nLast-Modified: " + date.split(" (")[0] + "\n\n\n{\"localDir\":\"" + localDir + "\",\"files\":\"\",\"fileContent\":\"THIS IS FILE: " + fileName + "\"}";
	console.log(response);
	socket.write(response);
	socket.pipe(socket);
}

function getFiles(socket) {
	let response = "";
	let responseLength = 0;
	
	fs.readdir(DIR_PATH + localDir, (err, data) => {
		if (data != undefined) {
			if (err) throw err;
			for (let i = 0; i < data.length;i++) {
				responseLength += data[i].length + 1;
			}

			responseLength += 44 + localDir.length;
			response = "HTTP/1.0 200 OK\nContent-Length: " + responseLength + "\nServer: localhost\nConnection: close\nContent-Type: text/html,text/plain; charset=utf-8\nDate: " + date.split(" (")[0] + "\nContent-Language: en-us\nLast-Modified: " + date.split(" (")[0] + "\n\n\n{\"localDir\":\"" + localDir + "\",\"files\":\"";
			for (let i = 0; i < data.length;i++) {
				response += data[i] + ";";
			}
			response += "\",\"fileContent\":\"\"}";
			console.log(response);
		}
		socket.write(response);
		socket.pipe(socket);
	});
}