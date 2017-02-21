var MongoClient = require('mongodb').MongoClient;
var schemaSetup = require('./schema_setup');
var indexesSetup = require('./indexes_setup');
var ensureTraderobot = require('./role_data');
var ensureTraderobotUser = require('./user_data');
var ensureUserHasRole = require('./relations_data');
var parseSetup = function(){
	var mongourl = process.env.CFMONGO || 'mongodb://localhost:27017/currencyfair';
	MongoClient.connect(mongourl, function(err, db) {
		if (err) {
			console.log("error conecting to mongodb");
		} else {
			schemaSetup.setupTrade(db,function(err,result){
				if(err){
					console.log("!!!!!! PARSE SCHEMA TRADE SETUP FAILED ");
					console.log(err);
				}
			});
			schemaSetup.setupStats(db,function(err,result){
				if(err){
					console.log("!!!!!! PARSE SCHEMA STATS SETUP FAILED ");
					console.log(err);
				}
			});
			schemaSetup.setupCurrency(db,function(err,result){
				if(err){
					console.log("!!!!!! PARSE SCHEMA CURRENCY SETUP FAILED ");
					console.log(err);
				}
			});
			schemaSetup.setupCountry(db,function(err,result){
				if(err){
					console.log("!!!!!! PARSE SCHEMA COUNTRY SETUP FAILED ");
					console.log(err);
				}
			});
			schemaSetup.setupRole(db,function(err,result){
				if(err){
					console.log("!!!!!! PARSE SCHEMA ROLE SETUP FAILED ");
					console.log(err);
				}
			});
			schemaSetup.setupCurrencyKeys(db,function(err,result){
				if(err){
					console.log("!!!!!! PARSE SCHEMA CURRENCYKEYS SETUP FAILED ");
					console.log(err);
				}
			});
			indexesSetup(db);

			//Traderobot role and user
			ensureTraderobot(db,function(err,roleId){
				if(err){
					console.log("!!!!!! PARSE TRADEROBOT ROLE SETUP FAILED ");
					console.log(err);
				} else {
					ensureTraderobotUser(db,function(err,userId){
						if(err){
							console.log("!!!!!! PARSE TRADEROBOT USER SETUP FAILED ");
							console.log(err);
						} else {
							ensureUserHasRole(db,userId,roleId,function(err,result){
								if(err){
									console.log("!!!!!! TRADEROBOT ASSIGNMENT TO TRADEROBOT ROLE FAILED ");
									console.log(err);
								}
							});
						}
					});
				}
			});
		}
	});
};
module.exports = parseSetup;
