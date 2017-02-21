var MongoClient = require('mongodb').MongoClient;
var cleanup = function(){

	MongoClient.connect(process.env.CFMONGO, function(err, db) {
		db.collection('Trade').drop();
		db.collection('Country').drop();
		db.collection('Currency').drop();
		db.collection('CurrencyKey').drop();
		db.collection('Stats').drop();
	});
};
module.exports = cleanup;