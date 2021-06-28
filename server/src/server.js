import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { join } from 'path';
import { spawn } from 'node-pty';
import { platform } from 'os';
import https from 'https';
import http from 'http';

// load local environment variables

if (fs.existsSync('.env')) {
	require('dotenv').config({ path: join(__dirname, '.env') });
}

// set up express
const app = express();

// set up middleware
app.use(cors());

// set up dummy route
app.get('/', (_req, res) => {
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
import { Server } from 'socket.io';

const io = new Server(server, {
	cors: {
		origin: 'https://terminalonline.netlify.app',
		credentials: true,
		methods: ['GET', 'POST']
	}
});

io.on('connection', socket => {
	console.log('Successfully set up server-side SocketIO');
	io.on('disconnection', () => console.log('Disconnected from server-side SocketIO'));

	const ptyProcess = spawn(platform() === 'win32' ? 'powershell.exe' : 'bash', [], {});

	ptyProcess.onData(data => {
		socket.emit('output', data);
	});

	socket.on('input', data => {
		ptyProcess.write(data);
	});
});

const PORT = process.env.PORT || 3000;

// launch the server
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
