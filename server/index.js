const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pty = require('node-pty');
const os = require('os');
const https = require('https');
const http = require('http');

// load local environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// set up express
const app = express();

// set up middleware
app.use(cors());

// set up dummy route
app.use('/', (_req, res) => {
	res.send(
		"Server is up and running 👍 (if you weren't expecting this message, you're doing something wrong)"
	);
});

let server;

const { SSL_KEY_FILE, SSL_CRT_FILE } = process.env;

if (SSL_CRT_FILE && SSL_KEY_FILE) {
	console.log('Found SSL certificates.');

	// set up https on local machine
	const key = fs.readFileSync(SSL_KEY_FILE);
	const cert = fs.readFileSync(SSL_CRT_FILE);

	/**
	 * @type {https.ServerOptions}
	 */
	const options = { key, cert };

	// initialize with https
	server = https.createServer(options, app);
} else {
	// initialize with http
	server = http.createServer(app);
}

// set up SocketIO
const { Server } = require('socket.io');

const io = new Server(server, {
	cors: {
		origin: 'https://localhost:8080',
		credentials: true,
		methods: ['GET', 'POST']
	}
});

io.on('connection', socket => {
	console.log('Successfully set up server-side SocketIO');
	io.on('disconnection', () => console.log('Disconnected from server-side SocketIO'));

	const ptyProcess = pty.spawn(os.platform() === 'win32' ? 'powershell.exe' : 'bash', [], {});

	ptyProcess.onData(data => {
		socket.emit('output', data);
	});

	socket.on('input', data => {
		ptyProcess.write(data);
	});
});

// launch the server
server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
