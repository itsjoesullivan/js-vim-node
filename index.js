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
	'keyword.operator': 'white',
	'string': 'white',
	'constant.character.escape': 'white',
	'comment': 'white',
	'constant.numeric': 'white',
	'keyword': 'white',
	'constant.language': 'white',
	'keyword.operator': 'white',
	'function.call': '#d7af5f',
	'storage.function': '#d7af5f',
	'entity.name.function': '#d7af5f',
	


	//js specific
	'selector': 'white',
	'support': 'white',
	'support.property': 'white',
	'support.function': 'white',
	'support.method': 'white',
	'support.tag.script': 'white',
	'string': 'white',
	'entity.tag.script': 'white',
	'string.regexp': 'white',
	'string.regexp.open': 'white',
	'contstant.regexp.escape': 'white',
	'string.regexp.close': 'white',
	'string.regexp.modifier': 'white',
	'storage': 'red',
	'entity.function': 'white',
	'keyword': 'white',
	'function.anonymous': '#d7af5f',
	'param': "#6B8E23"
});




	//Instance
	var vim = new Vim();


	//Handle keystrokes
	Keys = require('../keys');
	var keys = new Keys();

	//Listen for changes. Delta acts as a hint (small change, big change, line change, etc.)

	var _text = '';
	tui.clear();
	vim.view.on('change', function() {
		var text = vim.text();
		Rainbow.highlightBlockForLanguage(text, 'javascript', function(highlightedText) {
			vim.view.text = highlightedText;
			tui.write(vim.view.getText() );
		});
	});

	//Connect keys to vim instance
	keys.fn = function(key) {
		vim.exec(key);
	};
