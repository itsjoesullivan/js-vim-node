var vim;
var colors = require('colors');

colors.setTheme({
	text: 'white',
	cursor: 'inverse'
});


var View = module.exports = function(vimInstance) {
  var size = [100, 100];
	vim = vimInstance;
	this.init();
	var exec = require('child_process').exec,
    child;
	exec('tput lines', function(err, stdout) {
    size[1] = parseInt(stdout);
  })
  exec('tput cols', function(err, stdout) {
    size[0] = parseInt(stdout);
  })







};

var _text = '';
var stdout = process.stdout;

View.prototype.init = function() {
	CSI('0J');
	CSI('1J');
	CSI('1;1H');
	CSI('?25l');
};

var cursor = {
	line: 0,
	char: 0
};
View.prototype.render = function() {
    var text = vim.text();

	var lines = text.split('\n');
		cursor = vim.cursor().position();
		lines.forEach(renderLine);

//		CSI('0J');
//		CSI('1J');
    _text = text;
};

var _lines = {};
function renderLine(text,index) {
	//Check if we have the cursor
	var hasCursor = cursor.line === index;

	//Figure out just what the new text looks like
	var newText = '';
	if(hasCursor) {
		//Might be highlighted
		text += ' ';
		newText += (text.substring(0,cursor.char).text);
		newText += (text.substring(cursor.char,cursor.char+1).inverse);
		newText += (text.substring(cursor.char+1).text);
	} else {
		newText = text.text;
	}

	//If no change, ignore
	if(newText === _lines[index]) return;

	//Otherwise render and update
	CSI((index+1) + ';1f');
	//Clear the line
	CSI('0K');
	process.stdout.write(newText);
	_lines[index] = newText;
}



function CSI(arg) {
	process.stdout.write('\u001B[' + arg);
}
