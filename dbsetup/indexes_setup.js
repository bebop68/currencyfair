var setupIndexes = function(db){
	var stats = db.collection('Stats');
	stats.ensureIndex({currencyFrom:1,currencyTo:1,originatingCountry:1}, {unique:true}, function(err, indexName) {
		if(err){
			console.log("!!!!!! STATS INDEX SETUP FAILED ");
			console.log(err);
		}
	});
	var country = db.collection('Country');
	country.ensureIndex({country:1}, {unique:true}, function(err, indexName) {
		if(err){

			console.log("!!!!!! COUNTRY INDEX SETUP FAILED ");
			console.log(err);
		}
	});
	var currency = db.collection('Currency');
	currency.ensureIndex({currency:1}, {unique:true}, function(err, indexName) {
		if(err){
			console.log("!!!!!! CURRENCY INDEX SETUP FAILED ");
			console.log(err);
		}
	});
	var trade = db.collection('Trade');
	trade.ensureIndex({currencyFrom:1,currencyTo:1,originatingCountry:1,timePlaced:1}, {unique:false}, function(err, indexName) {
		if(err){
			console.log("!!!!!! TRADE INDEX SETUP FAILED ");
			console.log(err);
		}
	});

};
module.exports = setupIndexes;