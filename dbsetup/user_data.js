var ensureTraderobotUser = function(db,callback){
	var users = db.collection('_User');
	var userId = Date.now().toString();
	users.findOne({username:'traderobot'},function(err,data){
		if(err){
			callback(err,null);
		} else if(!data){
			users.insert({
				"_id": userId, //Parse does not handle mongo ObjectID
				"username" : "traderobot",
				"_hashed_password" : "$2a$10$cXfkkeLLKvfmobNVQDTt9uSYo7QGh2R7n/wJkJByhzOe4NBrFbkRm", //traderobot
				"_wperm" : [
					userId
				],
				"_rperm" : [
					"*",
					userId
				],
				"_created_at" : new Date(Date.now()),
				"_updated_at" : new Date(Date.now())
			},function(err, result){
				if(err){
					callback(err,null);
				} else {
					callback(null,userId);
				}
			});
		} else {
			callback(null,data._id);
		}
	});
};
module.exports = ensureTraderobotUser;