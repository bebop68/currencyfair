var ensureTraderobot = function(db,callback){
	var roleid =  Date.now().toString();
	var roles = db.collection('_Role');
	roles.findOne({name:'traderobot'},function(err,data){
		if(err){
			callback(err,null);
		} else if(!data){
			roles.insert({
				"_id": roleid, //Parse does not handle mongo ObjectID
				"name" : "traderobot",
				"_wperm" : [],
				"_rperm" : [],
				"_acl" : {},
				"_created_at" : new Date(Date.now()),
				"_updated_at" : new Date(Date.now())
			},function(err, result){
				if(err){
					callback(err,null);
				} else {
					callback(null,roleid);
				}
			});
		} else {
			callback(null,data._id);
		}
	});
};
module.exports = ensureTraderobot;