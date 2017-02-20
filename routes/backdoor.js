var Parse = require('parse/node').Parse;
Parse.initialize(process.env.PARSECFAPP || 'token123456');
Parse.serverURL = process.env.PARSECFURL || 'http://localhost:1338/parse';
var Trade = require('../cloud/models/trade');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('index', {title: 'Currency Fair Backdoor'});
});
router.post('/', function (req, res, next) {
	Parse.User.logIn("traderobot", "traderobot", {
		success: function(user){
			var trade = new Trade();
			trade.save({
				userId:req.body.userId,
				currencyFrom:req.body.currencyFrom,
				currencyTo:req.body.currencyTo,
				amountBuy:req.body.amountBuy,
				amountSell:req.body.amountSell,
				rate:req.body.rate,
				timePlaced:req.body.timePlaced,
				originatingCountry:req.body.originatingCountry
			},{ sessionToken: user.getSessionToken(), success:function(obj){
				res.json({objectId:obj.id,createdAt:obj.get('createdAt')});
			},error: function(obj, error) {
				res.status(400);
				res.json(error);
			}});
		},
		error: function(user, error) {
			res.status(403);
			res.json(error);
		}
	});
});

module.exports = router;
