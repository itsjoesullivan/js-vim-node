/* Commands specific to node.js, for instance shutting down (process.exit() ?) and opening files */

var fs = require('fs');

module.exports = function(vim) {


vim.addCommand({
	mode: 'command',
	match: /^:q\n$/,
	fn: function() {
		process.exit();
	}
});

vim.addCommand({
	mode: 'command',
	match: /^:o (.*)\n$/,
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
			vim.docs.push(doc);
			vim.curDoc = doc;
		} catch(e) {
		//ensure this is a file doesnt exist problem	
		//if so create as a new file.
		}
	}
});

};
