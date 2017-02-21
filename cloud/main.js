var Country = require('./models/country');
var Currency = require('./models/currency');
var Stats = require('./models/stats');
var Trade = require('./models/trade');
var CurrencyKey = require('./models/currencykey');

Parse.Cloud.beforeSave(Trade, function(request,response) {
	var trade = request.object;
	var valid = trade.validateData();
	if(!valid){
		response.error(trade.validationErrors);
	}
	trade.set('timePlaced',new Date(trade.get('timePlaced')));
	response.success();
	//Checking for currencies and countries
	var currencyFrom = trade.get("currencyFrom");
	var currencyFromQuery = new Parse.Query(Currency);
	currencyFromQuery.equalTo("currency", currencyFrom);
	currencyFromQuery.find().then(function(res){
		if(res.length == 0){
			var currency = new Currency();
			currency.save({currency:currencyFrom}, { useMasterKey: true })
		}
	});
	var currencyTo = trade.get("currencyTo");
	var currencyToQuery = new Parse.Query(Currency);
	currencyToQuery.equalTo("currency", currencyTo);
	currencyToQuery.find().then(function(res){
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
				"currenciesKey":currencyFrom+'-'+currencyTo,
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
	new Parse.Query(CurrencyKey).equalTo("key", currencyFrom+'-'+currencyTo)
	.find().then(function(res){
		var key = new CurrencyKey();
		if(res.length == 0){
			key.save({
				"key":currencyFrom+'-'+currencyTo
			}, { useMasterKey: true });
		}
	});
});



