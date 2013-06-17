var Vim = require('../js-vim');

	//Instance
	var vim = new Vim();

	//Create view
	var View = require('./lib/view');
	var view = new View(vim);

	//Handle keystrokes
	Keys = require('../keys');
	var keys = new Keys();

	//Listen for changes. Delta acts as a hint (small change, big change, line change, etc.)
	vim.on('change', function(delta) {
		view.render(delta);
	});

	//Connect keys to vim instance
	keys.fn = function(key) {
		vim.exec(key);
	};
