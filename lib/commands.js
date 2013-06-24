/* Commands specific to node.js, for instance shutting down (process.exit() ?) and opening files */

var fs = require('fs');

module.exports = function(vim) {


vim.addCommand({
	mode: 'command',
	match: /^:q\n$/,
	fn: function() {
		//Clear
		process.stdout.write('\u001B[2J');
		//Move to top
		process.stdout.write('\u001B[1;1H');
		//Exit
		process.exit();
	}
});



vim.addCommand({
	mode: 'command',
	match: /^:(?:e|o) (.*)\n$/,
	fn: function(keys, vim, match) {
		var filePath = match[1];
		var text = '';
		try {
			//Grab the doc
			text = fs.readFileSync(filePath,'binary');
			//Create the doc
			var doc = new vim.Doc();
			doc.path = filePath;
			doc.text(text);
			//Tell vim all about it
			vim.add(doc);
		} catch(e) {
		//ensure this is a file doesnt exist problem	
		//if so create as a new file.
		}
	}
});

vim.addCommand({
	mode: 'command',
	match: /^:w\n$/,
	fn: function(keys, vim, match) {
		var filePath = vim.curDoc.path;
		if(!filePath) {
			return vim.notify('E32: No file name');
		}
		var text = vim.curDoc.text();
		try {
			fs.writeFileSync(filePath,text,'binary');
		} catch(e) {
			throw e;
		}
		var status = '"' + filePath + '" ' + text.split('\n').length + 'L, ' + text.length + 'C written';
		vim.view.set('status',status);
		
		
	}
});

vim.addCommand({
	mode: 'command',
	match: 'ZZ',
	fn: function(keys, vim, match) {
		vim.exec(':w\n');
		vim.exec(':q\n');
	}
});

vim.addCommand({
	mode: 'command',
	match: '<C-c>',
	fn: function(keys, vim, match) {
		this.exec(':q\n');
		this.notify('Type  :quit<Enter>  to exit Vim');
	}
});

};
