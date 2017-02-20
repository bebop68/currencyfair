var ensureUserHasRole = function(db,userId,roleId,callback){
	var relations = db.collection('_Join:users:_Role');
	relations.findOne({owningId:roleId,relatedId:userId},function(err,data){
		if(err){
			callback(err,null);
		} else if(!data){
			relations.insert({owningId:roleId,relatedId:userId},function(err,data) {
				if(err){
					callback(err,null);
				} else {
					callback(null,true);
				}
			});
			callback(null,true);
		} else {
			callback(null,true);
		}
	});
};
module.exports = ensureUserHasRole;