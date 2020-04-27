
let app = angular.module('app', []);
app.controller('earth', function($scope,$http) {

	$scope.elist=[];
	$scope.submit = async function(){

		let timeDistance = document.getElementById("timeDistance").value;
		let radius = document.getElementById("radius").value;
		let magnitude = document.getElementById("magnitude").value;
		
		let latitude = "";
		let longitude = "";
		let address = "";
			

		var checked_left = document.getElementById('option1').checked;
		if(checked_left == false){

			console.log("HERE..");

			try{
				let resp = await fetch('http://ipgeolocation.com?json=1');


				 let data = await resp.json();
				 console.log(data);
				 var token_comma_pos = data["coords"].search(",");
				 latitude = data["coords"].substr(0, token_comma_pos);
				 longitude = data["coords"].substr(token_comma_pos+1);
			}catch(err){
				console.log("Unable to fetch IP");
			}
		}else{

			address = document.getElementById("addr").value;

		}

		console.log(latitude);
		console.log(longitude);
		console.log(address);
		


		$http({
			method: 'POST',
			url: '/search',
			data:{
				timeDistance:timeDistance,
				radius: radius,
				address: address,
				magnitude:magnitude,
				latitude: latitude,
				longitude: longitude
			}
		}).then(async function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available

			if(response['status']===201){
				alert("invalid address, try again");
				return;
			}
			

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
                var d = new Date(item['time']);
                var n = d.toISOString();

                $scope.elist.push({
                    location:item['place'],
                    time:n,
                    mag:item["mag"],
                    type:item["type"]
                });
				listoutput += "<li>" + item["place"] + " " + item["mag"];
				listoutput += " " + item["type"] + "</li>";
			}
			// document.getElementById("elist").innerHTML = listoutput;
		}, function errorCallback(response) {
			console.log("test failed");
			console.log(response);
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}


	$scope.updateText = async function(){
		var checked_left = document.getElementById('option1').checked;
		console.log(checked_left);
		if(checked_left == true){
			document.getElementById('optional_address').style.display = "inline-block";
		}else{
			document.getElementById('optional_address').style.display = "none";
		}
		
		// console.log(data);


	}
});




