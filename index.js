var Vim = require('js-vim'),

	//Instance
	vim = new vim(),

	//Create view
	view = require('./lib/view')(vim),

	//Handle keystrokes
	keys = require('./lib/keys');

	//Listen for changes. Delta acts as a hint (small change, big change, line change, etc.)
	vim.on('change', function(delta) {
		view.render(delta);
	});

	//Connect keys to vim instance
	keys.fn = function(key) {
		vim.exec(key);
	};
