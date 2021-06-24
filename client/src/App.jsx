import React from 'react';

import './scss/App.scss';

function App() {
	return (
		<section>
			<div className='terminal-wrapper'>
				<div className='button-bar'>
					<button className='minimize'>-</button>
					<button className='close'>x</button>
				</div>
				<div className='terminal'>TERMINAL HERE</div>
			</div>
		</section>
	);
}

export default App;
