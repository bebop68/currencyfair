var services =  angular.module('Services', []);
var app = angular.module('cfApp', ['ngMaterial', 'ngMdIcons', 'Services', 'chart.js']);

app.controller('AppCtrl', ['$scope','parseService', function($scope,parseService){
	//currency couple for chart

	$scope.chartlabels = [];
	$scope.chartseries = ['rate avg'];
	$scope.chartdata = [];

	$scope.ratecurrencies = [];
	$scope.tradesearch = {currencyFrom:'- all -',currencyTo:'- all -',originatingCountry:'- all -',timePlacedFrom:new Date()};
	$scope.trades = [];
	$scope.tradesubscription = null;
	$scope.ratesubscription = null;
	$scope.ratedata = [];

	$scope.createDiagData = function(){
		$scope.chartlabels = [];
		var rates = [];
		$scope.ratedata.forEach(function(item){
			$scope.chartlabels.push(item.originatingCountry);
			rates.push(item.rate);
		});
		$scope.chartdata = [rates];
	};


	$scope.ratekeyChanged = function(obj) {
		//console.log(obj.ratekey);
		parseService.getRates(obj.ratekey).then(function(res){
			if($scope.ratesubscription){
				$scope.ratesubscription.unsubscribe();
			}
			$scope.ratesubscription = res.subscription;
			$scope.ratedata = res.data;
			$scope.createDiagData();
			res.subscription.on('create', function(item){
				$scope.ratedata.push({
					sellTotal:item.get('sellTotal'),
					buyTotal:item.get('buyTotal'),
					rate:item.get('rate'),
					usersTotal:item.get('usersTotal'),
					originatingCountry:item.get('originatingCountry')
				});
				$scope.$applyAsync();
				$scope.createDiagData();
			});
		});
	};


	parseService.getCountries().then(function(res){
		$scope.countries = res.data;
		//web socket subscription related to the countries query
		res.subscription.on('create', function(country){
			$scope.countries.push(country.get("country"));
			$scope.countries = $scope.countries.sort();
			$scope.$applyAsync();
		});
	});
	parseService.getCurrencies().then(function(res){
		$scope.currencies = res.data;
		//web socket subscription related to the currencies query
		res.subscription.on('create', function(currency){
			$scope.currencies.push(currency.get("currency"));
			$scope.currencies = $scope.currencies.sort();
			$scope.$applyAsync();
		});
	});
	parseService.getRateCurrencies().then(function(res){
		$scope.ratecurrencies = res.data;
		//web socket subscription related to the ratecurrencies query
		res.subscription.on('create', function(ckey){
			$scope.ratecurrencies.push(ckey.get("key"));
			$scope.ratecurrencies = $scope.ratecurrencies.sort()
			$scope.$applyAsync();
		});
	});

	$scope.doTradeSearch = function(){
		parseService.getTrades($scope.tradesearch).then(function(res){
			$scope.trades = res.data;
			//Unsubscribe from previous web socket channel
			if($scope.tradesubscription){
				$scope.tradesubscription.unsubscribe();
			}
			$scope.tradesubscription = res.subscription;
			//event create on the query websocket channel
			res.subscription.on('create',function(trade){
				$scope.trades.push({
					userId:trade.get('userId'),
					currencyFrom:trade.get('currencyFrom'),
					currencyTo:trade.get('currencyTo'),
					amountSell:trade.get('amountSell'),
					amountBuy:trade.get('amountBuy'),
					rate:trade.get('rate'),
					timePlaced:trade.get('timePlaced'),
					originatingCountry:trade.get('originatingCountry'),
					createdAt:trade.get('createdAt')
				});
				$scope.trades = $scope.trades.sort(function(a,b){
					if (a.timePlaced > b.timePlaced)
						return -1;
					if (a.timePlaced < b.timePlaced)
						return 1;
					return 0;
				});
				$scope.$applyAsync();
			});
		});
	};
	$scope.doTradeSearch();
}]);
