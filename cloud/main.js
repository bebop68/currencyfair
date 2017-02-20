var Country = require('./models/country');
var Currency = require('./models/currency');
var Stats = require('./models/stats');
var Trade = require('./models/trade');

Parse.Cloud.beforeSave(Trade, function(request,response) {
	var trade = request.object;
	var valid = trade.validateData();
	if(!valid){
		response.error(trade.validationErrors);
	}
	response.success();
	//Checking for currencies and countries
	var currencyFrom = trade.get("currencyFrom");
	var currencyQuery = new Parse.Query(Currency);
	currencyQuery.equalTo("currency", currencyFrom);
	currencyQuery.find().then(function(res){
		if(res.length == 0){
			var currency = new Currency();
			currency.save({currency:currencyFrom}, { useMasterKey: true })
		}
	});
	var currencyTo = trade.get("currencyTo");
	currencyQuery.equalTo("currency", currencyTo);
	currencyQuery.find().then(function(res){
		if(res.length == 0){
			var currency = new Currency();
			currency.save({currency:currencyTo}, { useMasterKey: true })
		}
	});
	var countryName = trade.get("originatingCountry");
	var countryQuery = new Parse.Query(Country);
	countryQuery.equalTo("country", countryName);
	countryQuery.find().then(function(res){
		if(res.length == 0){
			var countryObj = new Country();
			countryObj.save({country:countryName}, { useMasterKey: true })
		}
	});
	//Stats Creation
	new Parse.Query(Stats)
		.equalTo("currencyFrom", currencyFrom)
		.equalTo("currencyTo", currencyTo)
		.equalTo("originatingCountry", countryName)
	.find().then(function(res){
		var stats = new Stats();
		if(res.length == 0){
			stats.save({
				"currencyFrom":currencyFrom,
				"currencyTo":currencyTo,
				"originatingCountry":countryName,
				"sellTotal":trade.get("amountSell"),
				"buyTotal":trade.get("amountBuy"),
				"rate":trade.get("rate"),
				"usersTotal":1
			}, { useMasterKey: true });
		} else {
			stats = res[0];
			var buyTotal = stats.get("buyTotal") + trade.get("amountBuy");
			var sellTotal = stats.get("sellTotal") + trade.get("amountSell");
			var rate = buyTotal/sellTotal;
			stats.save({
				"sellTotal":sellTotal,
				"buyTotal":buyTotal,
				"usersTotal":stats.get("usersTotal") + 1,
				"rate":rate
			}, { useMasterKey: true });
		}
	});
});



