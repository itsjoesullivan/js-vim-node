var vim;
var colors = require('colors');

colors.setTheme({
	text: 'white',
	cursor: 'inverse',
	idle: 'cyan',
	select: 'grey'
});

var size = [0,0];



var View = module.exports = function(obj) {
	vim = obj.vim;
	size = [obj.columns, obj.lines];
	this.init();
	






};

var _text = '';
var stdout = process.stdout;

var initialMessage = '' +
	'js-VIM - Vi IMproved\n' +
	'(implemented in JavaScript)\n'+
	'\n' +
	'version 0.0.0\n' +
	'based on VIM, by Bram Moolenaar et al.\n' +
	'JavaScript implementation by Joe Sullivan\n' + 
	'\n';

View.prototype.init = function() {
	CSI('0J');
	CSI('1J');
	CSI('1;1H');
	CSI('?25l');
	displayCentered(initialMessage)
};

var cursor = {
	line: 0,
	char: 0
};

var selection = false;
View.prototype.render = function() {
    var text = vim.text();

	var lines = text.split('\n');
	selection = vim.curDoc.selection();
		cursor = vim.cursor().position();
		if(lines.length < size[1]) {
			while(lines.length < size[1]) {
				lines.push('~'.cyan);
			}	
		}
		lines.forEach(renderLine);

    _text = text;
};

var _lines = {};
function inSelection(position) {
	var hasSelection = !(position.line < selection[0].line || position.line > selection[1].line)
	if(!hasSelection) return false;
	if(position.line < selection[1].line && position.line > selection[0].line) return true;
	if(position.line === selection[0].line && selection[1].line === selection[0].line) {
		return (position.char+1 >= selection[0].char && position.char+1 <= selection[1].char)
	}
	if(position.line === selection[0].line || position.line < selection[1].line) {
			return true;
	}
	if(position.line === selection[1].line || position.line > selection[0].line) {
		if(position.char+1 <= selection[1].char) return true;
	}
	return false;
}
function renderLine(text,index) {
	//Check if we have the cursor
	var hasCursor = cursor.line === index;
	var hasSelection = !(index < selection[0].line || index > selection[1].line)

	//Figure out just what the new text looks like
	var newText = '';
	var position
	if(hasSelection) {
		for(var i in text) {
			if(!text.hasOwnProperty(i)) continue;
			position = {
				line: index,
				char: parseInt(i)
			};
			if(inSelection(position)) {
				//if(hasCursor && cursor.char === position.char) {
				//	newText += text[i].cursor.inverse;
				//} else {
					newText += ('' + text[i]).select.grey.inverse.bold;
				//}
			} else {
				newText += ('' + text[i]).text;
			}
		}	
	} else if(hasCursor) {
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
//	process.stdout.write(newText);
	console.log(newText);
	_lines[index] = newText;
}

function displayCentered(message) {
	var lines = message.split('\n');
	var fromTop = (size[1] - lines.length)/2;
	CSI(fromTop + ';1H');
	lines.forEach(function(line) {
		process.stdout.write(centeredLine(line) + '\n')
	});
}

function centeredLine(line) {
	var newLine = line;
	var offset = (size[0]-line.length) / 2
	while(offset-- > 0) {
		newLine = ' ' + newLine;	
	}
	return newLine;
}

function CSI(arg) {
	process.stdout.write('\u001B[' + arg);
}
