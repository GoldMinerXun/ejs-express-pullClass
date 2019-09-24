var nodecr = require('../lib/nodecr');

// uncomment this to quiet nodecr
//nodecr.log = function() {};

nodecr.process(__dirname + '/image.png',function(err, text) {
	if(err) {
		console.error(err);
	} else {
		console.log("Result:");
		console.log(text);
	}
}, null, null, null, nodecr.preprocessors.convert);