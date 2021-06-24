const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

// load local environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// set up https on local machine
const key = fs.readFileSync(process.env.SSL_KEY_FILE);
const cert = fs.readFileSync(process.env.SSL_CRT_FILE);

/**
 * @type {https.ServerOptions}
 */
const options = { key, cert };

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

// launch server
const server = https.createServer(options, app);

server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
