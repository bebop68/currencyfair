const chai = require('chai');
const chai_as_promised = require("chai-as-promised");
const express = require('express');
const http = require('http');
const parse_server = require('parse-server').ParseServer;
const path = require('path');
const assert = require('assert');
const Parse = require('parse/node');

const app_id = "app_id";
const database_uri = "mongodb://localhost:27017/currencyfairtest";
const master_key = "masterkey";
const server_url = "http://localhost:1337/parse";
const parseSetup = require('../dbsetup/parse_setup');
const cleanUp = require('../testsetup/cleanup');
const Country = require('../cloud/models/country');
const Currency = require('../cloud/models/currency');
const Stats = require('../cloud/models/stats');
const Trade = require('../cloud/models/trade');
const CurrencyKey = require('../cloud/models/currencykey');



chai.use(chai_as_promised);
process.env.CFMONGO = "mongodb://localhost:27017/currencyfairtest";
cleanUp();
parseSetup();

function startServer() {
	return new Promise(function(resolve, reject) {
		const api = new parse_server({
			databaseURI: database_uri,
			cloud: "cloud/main.js",
			appId: app_id,
			masterKey: master_key,
			serverURL: server_url
		});

		const app = express();
		app.use('/public', express.static(path.join(__dirname, '/public')));
		app.use('/parse', api);

		var httpServer = http.createServer(app);
		httpServer.listen(1337, function(error) {
			if (error) {
				reject();
			}
			else {
				resolve(httpServer);
			}
		});
	});
}

function stopServer(httpServer) {
	httpServer.close(function() {
		console.log("Stopping server.");
	});
}

// UNIT test begin
describe('Parse Test', function() {
	var server;

	beforeEach(function() {
		return startServer().then(function(httpServer) {
			Parse.initialize(app_id, "", master_key);
			Parse.serverURL = 'http://localhost:1337/parse';
			server = httpServer;
		});
	});

	afterEach(function() {
		return Promise.resolve().then(function() {
			return stopServer(server)
		});
	});
	it('should not save an invalid trade', function(done) {
		Promise.resolve().then(function() {
			var trade = new Trade();
			return trade.save();
		}).catch(function(err){
			assert.equal(err.message.userId, "required");
			assert.equal(err.message.currencyFrom, "required");
			assert.equal(err.message.currencyTo, "required");
			assert.equal(err.message.amountSell, "required");
			assert.equal(err.message.amountBuy, "required");
			assert.equal(err.message.rate, "required");
			assert.equal(err.message.timePlaced, "required");
			assert.equal(err.message.originatingCountry, "required");
			done();
		});
	});
	it('should not save a trade without a session and a valid user', function(done) {
		Promise.resolve().then(function() {
			var trade = new Trade();
			return trade.save({
				userId:'134256',
				currencyFrom:'EUR',
				currencyTo:'GBP',
				amountSell:1000,
				amountBuy:747.10,
				rate: 0.7471,
				timePlaced:'24-JAN-15 10:27:44',
				originatingCountry:'FR'
			});
		}).catch(function(err){
			assert.equal(err.message,'Permission denied for action create on class Trade.');
			done();
		});
	});
	it('should save a trade with a session and a valid user', function(done) {
		Promise.resolve().then(function() {
			Parse.User.logIn("traderobot", "traderobot", {
				success: function(user) {
					var trade = new Trade();
					return trade.save({
						userId:'134256',
						currencyFrom:'EUR',
						currencyTo:'GBP',
						amountSell:1000,
						amountBuy:747.10,
						rate: 0.7471,
						timePlaced:'24-JAN-15 10:27:44',
						originatingCountry:'FR'
					},{ sessionToken: user.getSessionToken(), success:function(obj){
						done();
					}});
				}
			});
		})
	});
	it('should create country,currency, currencykey and stats after a trade post', function(done) {
		Promise.resolve().then(function() {
			Parse.User.logIn("traderobot", "traderobot", {
				success: function(user) {
					var trade = new Trade();
					return trade.save({
						userId:'134256',
						currencyFrom:'AUD',
						currencyTo:'YEN',
						amountSell:1000,
						amountBuy:747.10,
						rate: 0.7471,
						timePlaced:'24-JAN-15 10:27:44',
						originatingCountry:'JP'
					},{ sessionToken: user.getSessionToken(), success:function(obj){
						setTimeout(function(){
							var countryQuery = new Parse.Query(Country);
							countryQuery.equalTo("country", 'JP');
							countryQuery.find().then(function(res){
								assert(res.length, 1);
								var currencyQuery = new Parse.Query(Currency);
								currencyQuery.equalTo("currency", 'AUD');
								return currencyQuery.find();
							}).then(function(res){
								assert(res.length, 1);
								var currencyQuery = new Parse.Query(Currency);
								currencyQuery.equalTo("currency", 'YEN');
								return currencyQuery.find();
							}).then(function(res){
								assert(res.length, 1);
								var statsQuery = new Parse.Query(Stats)
								.equalTo("currencyFrom", 'AUD')
								.equalTo("currencyTo", 'YEN')
								.equalTo("originatingCountry", 'JP');
								return statsQuery.find();
							}).then(function(res){
								assert(res.length, 1);
								var q = new Parse.Query(CurrencyKey)
								.equalTo("key", 'AUD-YEN');
								return q.find();
							}).then(function(res){
								assert(res.length, 1);
								done();
							});
						}, 200);
					}});
				}
			});
		})
	});
});