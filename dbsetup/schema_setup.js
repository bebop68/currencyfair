var schemaCollection = '_SCHEMA';
var setupTrade = function(db,callback){
	var schema = db.collection(schemaCollection);
	schema.update({'_id':'Trade'},{
		'objectId':'string',
		'updatedAt':'date',
		'createdAt':'date',
		'userId':'string',
		'currencyFrom':'string',
		'currencyTo':'string',
		'amountSell':'number',
		'amountBuy':'number',
		'rate':'number',
		'timePlaced':'date',
		'originatingCountry':'string',
		'_metadata' : {
			'class_permissions':{
				'get':{},
				'find':{
					"*" : true
				},
				'create':{
					'role:traderobot' : true
				},
				'update':{},
				'delete':{},
				'addField':{
					'role:traderobot':true
				}

			}
		}
	},{upsert:true, w: 1},function(err, result){
		callback(err, result);
	});
};
var setupStats = function(db,callback){
	var schema = db.collection(schemaCollection);
	schema.update({'_id':'Stats'},{
		'objectId':'string',
		'updatedAt':'date',
		'createdAt':'date',
		'currencyFrom':'string',
		'currencyTo':'string',
		'originatingCountry':'string',
		'sellTotal':'number',
		'buyTotal':'number',
		'rate':'number',
		'usersTotal':'number',
		'currenciesKey':'string',
		'_metadata' : {
			'class_permissions':{
				"get" : {
					"*" : true
				},
				"find" : {
					"*" : true
				},
				"create" : {},
				"update" : {},
				"delete" : {},
				"addField" : {}
			}
		}
	},{upsert:true, w: 1},function(err, result){
		callback(err, result);
	});

};
var setupCurrency = function(db,callback){
	var schema = db.collection(schemaCollection);
	schema.update({'_id':'Currency'},{
		'objectId':'string',
		'updatedAt':'date',
		'createdAt':'date',
		'currency':'string',
		'_metadata' : {
			'class_permissions':{
				"get" : {
					"*" : true
				},
				"find" : {
					"*" : true
				},
				"create" : {},
				"update" : {},
				"delete" : {},
				"addField" : {}
			}
		}
	},{upsert:true, w: 1},function(err, result){
		callback(err, result);
	});

};
var setupCountry = function(db,callback){
	var schema = db.collection(schemaCollection);
	schema.update({'_id':'Country'},{
		'objectId':'string',
		'updatedAt':'date',
		'createdAt':'date',
		'country':'string',
		'_metadata' : {
			'class_permissions':{
				"get" : {
					"*" : true
				},
				"find" : {
					"*" : true
				},
				"create" : {},
				"update" : {},
				"delete" : {},
				"addField" : {}
			}
		}
	},{upsert:true, w: 1},function(err, result){
		callback(err, result);
	});

};
var setupRole = function(db,callback){
	var schema = db.collection(schemaCollection);
	schema.update({'_id':'_Role'},{
		"_id" : "_Role",
		"objectId" : "string",
		"updatedAt" : "date",
		"createdAt" : "date",
		"name" : "string",
		"users" : "relation<_User>",
		"roles" : "relation<_Role>"
	},{upsert:true, w: 1},function(err, result){
		callback(err, result);
	});

};
var setupCurrencyKeys = function(db,callback){
	var schema = db.collection(schemaCollection);
	schema.update({'_id':'CurrencyKey'},{
		'objectId':'string',
		'updatedAt':'date',
		'createdAt':'date',
		'key':'string',
		'_metadata' : {
			'class_permissions':{
				"get" : {
					"*" : true
				},
				"find" : {
					"*" : true
				},
				"create" : {},
				"update" : {},
				"delete" : {},
				"addField" : {}
			}
		}
	},{upsert:true, w: 1},function(err, result){
		callback(err, result);
	});
};

module.exports = {
	setupTrade:setupTrade,
	setupStats:setupStats,
	setupCurrency:setupCurrency,
	setupCountry:setupCountry,
	setupRole:setupRole,
	setupCurrencyKeys:setupCurrencyKeys
};