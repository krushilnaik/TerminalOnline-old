import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

import 'xterm/css/xterm.css';

import './scss/App.scss';

function App() {
	useEffect(() => {
		const socket = io('https://localhost:3000');
		const terminal = new Terminal({
			cursorBlink: true,
			theme: {
				background: 'darkslateblue'
			}
		});

		const fitAddon = new FitAddon();

		terminal.loadAddon(fitAddon);
		terminal.loadAddon(new WebLinksAddon());

		terminal.onData(data => socket.emit('input', data));
		socket.on('output', data => terminal.write(data));

		const root = document.getElementById('terminal');
		root.innerHTML = '';

		terminal.open(root);
		fitAddon.fit();
	});

	return (
		<section>
			<div className='terminal-wrapper'>
				<div className='button-bar'>
					<button className='minimize'>-</button>
					<button className='close'>x</button>
				</div>

				<div id='terminal'>Terminal Online</div>
			</div>
		</section>
	);
}

export default App;
