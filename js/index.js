let app = angular.module('app', []);
app.controller('earth', function($scope,$http) {
	$scope.submit =() =>{
		let timeDistance = document.getElementById("timeDistance").value;
		let radius = document.getElementById("radius").value;
		let magnitude = document.getElementById("magnitude").value;
		let address = document.getElementById("addr").value;

		$http({
			method: 'POST',
			url: '/search',
			data:{
				timeDistance:timeDistance,
				radius: radius,
				address: address,
				magnitude:magnitude
			}
		}).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			console.log(response);

			if("latitude" in response["data"] && response["data"]["latitude"] != "" &&
				"longitude" in response["data"] && response["data"]["longitude"] != ""){
				let modified_address_url =  "https://www.google.com/maps/embed/v1/view?key=AIzaSyCyiNBcDIKlzVhqH8uJpRK3gcxkhI-lS2s";
				modified_address_url += "&center=";
				modified_address_url += response["data"]["latitude"];
				modified_address_url += ",";
				modified_address_url += response["data"]["longitude"];
				modified_address_url += "&zoom=18&maptype=satellite";
				document.getElementById("frame_map").src = modified_address_url;
			}
			console.log("success test");
			quake_list = response["data"]["quake_list"]["features"];
			console.log("quake_list");
			console.log(quake_list);
			listoutput = "";
			for (var i=0; i<quake_list.length; i++) {
				item = quake_list[i]["properties"];
				edate = new Date(item["time"]);
				listoutput += "<li>Location: " + item["place"] + "<br>   Magnitude: " + item["mag"];
				listoutput += "<br>  Type: " + item["type"] + "<br> Date: " + edate.toISOString() + "</li>";
			}
			document.getElementById("elist").innerHTML = listoutput;
		}, function errorCallback(response) {
			console.log("test failed");
			console.log(response);
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
});




 