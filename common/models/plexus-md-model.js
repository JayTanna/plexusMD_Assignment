'use strict';

var isomorphicfetch = require("isomorphic-fetch");
var moment = require('moment-timezone');

module.exports = function(Plexusmdmodel) {
	function getCityLocation(inputCityName,x){
		var GOOGLE_BASE = "https://maps.googleapis.com/maps/api/geocode/json?address="+inputCityName+"&key=AIzaSyDwu07vEhT_6vYMnle9L8iWkZR1-VjlrPA";
		fetch(GOOGLE_BASE, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response)=>{
			if( response.status === 200 ) {
				return response;
			} else {
				return new Error(response.status);
			}
		}).then( (response) => {
			return response.json();
		}).then( (response) => {
			var retrievedLocation = response.results[0].geometry.location;
			console.log(response.results[0].geometry.location);
			getTimeZone(retrievedLocation,x)
		}).catch( (error) =>{
			console.error(error);
		})
	}


	function getTimeZone(locationObj, x) {
		var GOOGLE_BASE = "https://maps.googleapis.com/maps/api/timezone/json?location="+locationObj.lat+","+locationObj.lng+"&timestamp=0&key=AIzaSyDwu07vEhT_6vYMnle9L8iWkZR1-VjlrPA";
		fetch(GOOGLE_BASE, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response)=>{
			if( response.status === 200 ) {
				return response;
			} else {
				return new Error(response.status);
			}
		}).then( (response) => {
			return response.json();
		}).then( (response) => {
			var returnObj = {
				time: moment().tz(response.timeZoneId).format("HH:mm:ss"),
				location: locationObj
			}
			x(null,returnObj);
		}).catch( (error) =>{
			console.error(error);
		})

		
	}
	
	Plexusmdmodel.cityInfo = function(inputCityName, x) {
		getCityLocation(inputCityName,x);
	}
	
	Plexusmdmodel.remoteMethod(
    'cityInfo', {
		http: { path: '/cityInfo', verb: 'get'},
		accepts: {arg: 'inputCityName', type: 'string'},
		returns: {arg: 'cityInfo', type: 'object'}
    }
  );

};
