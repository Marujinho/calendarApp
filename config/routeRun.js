angularApp.run(function($rootScope, usersAPIService, $location) {
	$rootScope.global = {
		// link: "https://api.iv2.com.br/EasyCalendar-1.1.0"
		link: "https://deveasyprojectapi.iv2.com.br/EasyCalendar-1.1.0",
		// link: "https://demoeasyprojectapi.iv2.com.br/EasyCalendar-1.1.0",
		// token: "demo-54sa-da4w-ad42"
		// token: "dev3-ks4d-as42-83hk"
		//j5j5-d5u4-hdr5-tf9u
		//42119956855

		 
    //DB
	
	getUserCode: function(callback){ 
		var calendarDb = idb.open('calendarDb', 1, function(upgradeDb){
		});

		calendarDb.then(function(db){
		var tx = db.transaction('user');
		var keyValStore = tx.objectStore('user');
		return keyValStore.get('userCode');
		}).then(function(val){
			alert(val);  
			return callback(val);
		});
		//DB
	}






	}
});