var program = require('commander');


program
	.version('0.0.1')
	.parse(process.argv);


//Main app
var Vim = require('js-vim'),
	//Renderer
	tui = require('terminal-ui');

//Syntax highlighter

//Color scheme
var mauve = require('mauve');
var scheme = require('./lib/scheme');
mauve.set(scheme);

//Instance
var vim = new Vim();

//TODO let this be in the constructor
function setSize() {
vim.view.cols = process.stdout.columns;
vim.view.lines = process.stdout.rows;
}
process.stdout.on('resize', setSize);
setSize();


//Apply node commands (file write, etc.)
require('./lib/commands')(vim);


//Keystrokes
Keys = require('terminal-keys');
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

var files = [];//TODO: make this take cl args
if(files.length) {
	vim.exec(':e ' + files.shift() +'\n');
}
