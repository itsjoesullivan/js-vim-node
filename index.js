var program = require('commander');


program
	.version('0.0.1')
	.option('--columns <num>', 'Columns in display', parseInt)
	.option('--lines <num>', 'Lines in display', parseInt)
	.option('--args [arguments]', 'Arguments from original command')
	.parse(process.argv);

var files = process.argv.slice(process.argv.indexOf('--args')+1)

//Main app
var Vim = require('../js-vim'),
	//Renderer
	tui = require('../terminal-ui');

//Syntax highlighter
var Rainbow = require('../rainbow/js/rainbow.js');
//Language
require('../rainbow/js/language/javascript.js')(Rainbow);

//Color scheme
var mauve = require('mauve');
var scheme = require('./lib/scheme');
mauve.set(scheme);

//Instance
var vim = new Vim();
//TODO let this be in the constructor
vim.view.cols = program.columns;
vim.view.lines = program.lines;

//Apply node commands (file write, etc.)
require('./lib/commands')(vim);


//Keystrokes
Keys = require('../keys');
var keys = new Keys();

//Connect keys to vim instance
keys.fn = function(key) {
	vim.exec(key);
};

//Clear the terminal screen
tui.clear();

//Tie tui to vim.view
vim.view.on('change', function() {
	tui.write(vim.view.getText());
});

//Open file if one has been indicated

if(files.length) {
	vim.exec(':e ' + files.shift() +'\n');
}
