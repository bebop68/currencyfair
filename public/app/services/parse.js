services.service('parseService', ['$q', '$timeout',function($q,$timeout){
	this.getCountries = function(){
		var defered = $q.defer();
		var q = new Parse.Query('Country').ascending('country');
		q.find().then(function(res){
			var data = res.map(function(item){
				return item.get('country');
			});
			data.unshift('- all -');
			defered.resolve({data:data,subscription:q.subscribe()});
		}).catch(function(err){
			defered.reject(err);
		});
		return defered.promise;
	};
	this.getCurrencies = function(){
		var defered = $q.defer();
		var q = new Parse.Query('Currency').ascending('currency');
		q.find().then(function(res){
			var data = res.map(function(item){
				return item.get('currency');
			});
			data.unshift('- all -');
			defered.resolve({data:data,subscription:q.subscribe()});
		}).catch(function(err){
			defered.reject(err);
		});
		return defered.promise;
	};
	this.getRateCurrencies = function(){
		var defered = $q.defer();
		var q = new Parse.Query('CurrencyKey');
		q.find().then(function(res){
			var data = res.map(function(item){
				return item.get('key');
			});
			defered.resolve({data:data,subscription:q.subscribe()});
		});
		return defered.promise;
	};
	this.getTrades = function(options){
		var defered = $q.defer();
		var q = new Parse.Query('Trade');
		if(options.currencyFrom != '- all -'){
			q.equalTo('currencyFrom',options.currencyFrom);
		}
		if(options.currencyTo != '- all -'){
			q.equalTo('currencyTo',options.currencyTo);
		}
		if(options.originatingCountry != '- all -'){
			q.equalTo('originatingCountry',options.originatingCountry);
		}
		q.descending('timePlaced');
		q.find().then(function(res){
			var data = res.map(function(item){
				return {
					userId:item.get('userId'),
					currencyFrom:item.get('currencyFrom'),
					currencyTo:item.get('currencyTo'),
					amountSell:item.get('amountSell'),
					amountBuy:item.get('amountBuy'),
					rate:item.get('rate'),
					timePlaced:item.get('timePlaced'),
					originatingCountry:item.get('originatingCountry'),
					createdAt:item.get('createdAt')
				}
			});
			defered.resolve({data:data,subscription:q.subscribe()});
		}).catch(function(err){
			defered.reject(err);
		});
		return defered.promise;
	};
	this.getRates = function(key){
		var defered = $q.defer();
		var q = new Parse.Query('Stats');
		q.equalTo("currenciesKey", key);
		q.ascending('originatingCountry');
		q.find().then(function(res){
			var data = res.map(function(item){
				return {
					sellTotal:item.get('sellTotal'),
					buyTotal:item.get('buyTotal'),
					rate:item.get('rate'),
					usersTotal:item.get('usersTotal'),
					originatingCountry:item.get('originatingCountry')
				}
			});
			defered.resolve({data:data,subscription:q.subscribe()});
		});
		return defered.promise;
	};
}]);