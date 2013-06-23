var program = require('commander');

program
	.version('0.0.1')
	.option('--columns <num>', 'Columns in display', parseInt)
	.option('--lines <num>', 'Lines in display', parseInt)
	.parse(process.argv);



var Vim = require('../js-vim');


var tui = require('../terminal-ui');

var Rainbow = require('../rainbow/js/rainbow.js');
require('../rainbow/js/language/javascript.js')(Rainbow);
var mauve = require('mauve');

mauve.set({

	//generic
	'keyword.operator': '#d7af5f',
	'string': '#d7af5f',
	'constant.character.escape': '#d7af5f',
	'comment': '#d7af5f',
	'constant.numeric': '#d7af5f',
	'keyword': '#d7af5f',
	'constant.language': '#d7af5f',
	'keyword.operator': '#d7af5f',
	'function.call': '#d7af5f',
	'storage.function': '#d7af5f',
	'entity.name.function': '#d7af5f',
	


	//js specific
	'selector': '#d7af5f',
	'support': '#d7af5f',
	'support.property': '#d7af5f',
	'support.function': '#d7af5f',
	'support.method': '#d7af5f',
	'support.tag.script': '#d7af5f',
	'string': '#d7af5f',
	'entity.tag.script': '#d7af5f',
	'string.regexp': '#d7af5f',
	'string.regexp.open': '#d7af5f',
	'contstant.regexp.escape': '#d7af5f',
	'string.regexp.close': '#d7af5f',
	'string.regexp.modifier': '#d7af5f',
	'storage': 'red',
	'entity.function': '#d7af5f',
	'keyword': '#d7af5f',
	'function.anonymous': '#d7af5f',
	'param': "#6B8E23"
});




	//Instance
	var vim = new Vim();

	require('./lib/commands')(vim);


	//Handle keystrokes
	Keys = require('../keys');
	var keys = new Keys();

	//Listen for changes. Delta acts as a hint (small change, big change, line change, etc.)

	var _text = '';
	tui.clear();

	//Let vim know how big screen is.
	vim.view.cols = program.columns;
	vim.view.lines = program.lines;
	var tmpText = '';

	vim.view.on('change', function() {
		//Grab the text
		var text = vim.text();
		//Do syntax on it.
		Rainbow.highlightBlockForLanguage(text, 'javascript', function(highlightedText) {
			//Set as view
			vim.view.text = highlightedText;
			var viewText = vim.view.getText();
//			console.log('are they the same?',tmpText === viewText);
			tmpText = viewText;
			//Render the text into a view and write it to screen
			tui.write( viewText );
		});
	});

	//Connect keys to vim instance
	keys.fn = function(key) {
		vim.exec(key);
	};
