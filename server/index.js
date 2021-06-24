const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// load local environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// set up server
const app = express();

// set up middleware
app.use(cors());

// set up dummy route
app.use('/', (_req, res) => {
	res.send(
		"Server is up and running 👍 (if you weren't expecting this message, you're doing something wrong)"
	);
});

const { SSL_KEY_FILE, SSL_CRT_FILE } = process.env;

if (SSL_CRT_FILE && SSL_KEY_FILE) {
	// set up https on local machine
	const https = require('https');

	const key = fs.readFileSync(SSL_KEY_FILE);
	const cert = fs.readFileSync(SSL_CRT_FILE);

	/**
	 * @type {https.ServerOptions}
	 */
	const options = { key, cert };

	// launch secure local server
	const server = https.createServer(options, app);

	server.listen(3000, () => {
		console.log('Local server listening on port 3000');
	});
} else {
	app.listen(3000, () => {
		console.log('Server listening on port 3000');
	});
}
