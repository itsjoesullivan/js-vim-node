/* Commands specific to node.js, for instance shutting down (process.exit() ?) and opening files */

module.exports = function(vim) {


vim.addCommand({
	mode: 'command',
	match: /^:q\n$/,
	fn: function() {
		process.exit();
	}
});

};
