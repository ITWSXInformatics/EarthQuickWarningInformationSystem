$("#optional_address").hide();

async function initMap() {
    let latitude = "";
    let longitude = "";
    let resp = await fetch('http://ipgeolocation.com?json=1');
    let data = await resp.json();
    console.log(data);
    var token_comma_pos = data["coords"].search(",");
    latitude = data["coords"].substr(0, token_comma_pos);
    longitude = data["coords"].substr(token_comma_pos + 1);
    var myLatLng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
    console.log(myLatLng);
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: myLatLng,
    });

    console.log(map);
    var cityCircle = new google.maps.Circle({
        strokeColor: '#9fff82',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#9fff82',
        fillOpacity: 0.35,
        map: map,
        center: myLatLng,
        radius: 100 * 1609.34
    });


		/*
    $("#button").click(() => {
        //if(not default ){get new ip}
        if (document.getElementById('option1').checked) {
            //reset map
            // add new markers here
            // Adds a marker to the map and push to the array.
            var marker = new google.maps.Marker({
                position: {lat:42,lng:-71},
                map: map
            });
            //get new address, and create new makers
            map.setCenter({lat:42,lng:-70});
            // accordingly to radius
            map.setZoom(9);
        }
    })
		*/

}



let app = angular.module('app', []);
app.controller('earth', function ($scope, $http) {

    $scope.elist = [];
    $scope.submit = async function () {

        let timeDistance = document.getElementById("timeDistance").value;
        let radius = document.getElementById("radius").value;
        let magnitude = document.getElementById("magnitude").value;

        let latitude = "";
        let longitude = "";
        let address = "";


        var checked_left = document.getElementById('option1').checked;
        if (checked_left == false) {

            console.log("HERE..");

            try {
                let resp = await fetch('http://ipgeolocation.com?json=1');


                let data = await resp.json();
                console.log(data);
                var token_comma_pos = data["coords"].search(",");
                latitude = data["coords"].substr(0, token_comma_pos);
                longitude = data["coords"].substr(token_comma_pos + 1);

            } catch (err) {
                console.log("Unable to fetch IP");
            }
        } else {

            address = document.getElementById("addr").value;

        }

        console.log(latitude);
        console.log(longitude);
        console.log(address);


        $http({
            method: 'POST',
            url: '/search',
            data: {
                timeDistance: timeDistance,
                radius: radius,
                address: address,
                magnitude: magnitude,
                latitude: latitude,
                longitude: longitude
            }
        }).then(async function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

            if (response['status'] === 201) {
                alert("invalid address, try to include state name, zip code, or country name");
                return;
            }


            if ("latitude" in response["data"] && response["data"]["latitude"] != "" &&
                "longitude" in response["data"] && response["data"]["longitude"] != "") {
                let modified_address_url = "https://www.google.com/maps/embed/v1/view?key=AIzaSyCyiNBcDIKlzVhqH8uJpRK3gcxkhI-lS2s";
                modified_address_url += "&center=";
                modified_address_url += response["data"]["latitude"];
                modified_address_url += ",";
                modified_address_url += response["data"]["longitude"];
                modified_address_url += "&zoom=18&maptype=satellite";
                // document.getElementById("frame_map").src = modified_address_url;
            }
            console.log("success test");
            quake_list = response["data"]["quake_list"]["features"];
            console.log("quake_list");
            console.log(quake_list);
            listoutput = "";

						quake_coords = [];

						for (var i = 0; i < quake_list.length; i++) {
							quake_coords.push([quake_list[i]["geometry"]["coordinates"][1], quake_list[i]["geometry"]["coordinates"][0]]);
						}

						console.log(quake_coords);

						//Warnings
						var danger = '<br /> \
							<div class="alert alert-danger" role="alert"> \
								<i class="fas fa-exclamation-triangle"></i> There is an earthquake in your area. Please take shelter. <i class="fas fa-exclamation-triangle"></i> \
							</div>'

						var warning = '<br /> \
							<div class="alert alert-warning" role="alert"> \
								<i class="fas fa-exclamation"></i> There is an earthquake in close by but not in your immediate area. <i class="fas fa-exclamation"></i> \
							</div>'

						var safe = '<br /> \
							<div class="alert alert-success" role="alert"> \
								<i class="fas fa-thumbs-up"></i> There are no earthquakes in your area <i class="fas fa-thumbs-up"></i> \
							</div>'


            var closeQuake = false;
            var nearQuake = false;

            for (var x = 0; x < quake_coords.length; x++) {
              //in km
              var dist = calcCrow(response["data"]["latitude"], response["data"]["longitude"], quake_coords[x][0], quake_coords[x][1])
              console.log(dist);
              if (dist <= 10) {
                nearQuake = true;
              }
              if (dist <= 5) {
                closeQuake = true;
              }
            }

            if (closeQuake == true) {
              document.getElementById("warningArea").innerHTML = danger;
            }
            else if (nearQuake == true) {
              document.getElementById("warningArea").innerHTML = warning;
            }
            else{
              document.getElementById("warningArea").innerHTML = safe;
            }



						//Update Google Maps
						if (document.getElementById('option1').checked || document.getElementById('option2').checked) {

								let latitude = "";
								let longitude = "";
								let resp = await fetch('http://ipgeolocation.com?json=1');
								let data = await resp.json();
								console.log(data);
								var token_comma_pos = data["coords"].search(",");
								latitude = response["data"]["latitude"]; //data["coords"].substr(0, token_comma_pos);
								longitude = response["data"]["longitude"]; //data["coords"].substr(token_comma_pos + 1);
								var myLatLng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
								console.log(myLatLng);
								var markers = [];
								var map = new google.maps.Map(document.getElementById('map'), {
										zoom: 6,
										center: myLatLng,
								});

								console.log(map);
								var cityCircle = new google.maps.Circle({
										strokeColor: '#9fff82',
										strokeOpacity: 0.8,
										strokeWeight: 2,
										fillColor: '#9fff82',
										fillOpacity: 0.35,
										map: map,
										center: myLatLng,
										radius: radius * 1609.34
								});

								//reset map
								// add new markers here
								// Adds a marker to the map and push to the array.
								/*
								var marker = new google.maps.Marker({
										position: {lat:42,lng:-71},
										map: map
								});
								*/

                //Place markers on the map for each earthquake
								for (var x = 0; x < quake_coords.length; x++) {
									new google.maps.Marker({
											position: {lat: parseFloat(quake_coords[x][0]), lng: parseFloat(quake_coords[x][1])},
											map: map
									});
								}
								/*
								var marker = new google.maps.Marker({
										position: {lat:44.519100000000002,lng:-115.30800000000001},
										map: map
								});
								var marker2 = new google.maps.Marker({
										position: {lat:31.9613333,lng:-117.30549999999999},
										map: map
								});
								*/
								//get new address, and create new makers
								//map.setCenter({lat:37.752113,lng:-122.447578});
								// accordingly to radius
								map.setZoom(4);
								//get new address, and create new makers
								map.setCenter({lat: parseFloat(latitude), lng: parseFloat(longitude)});
								// accordingly to radius
								map.setZoom(3);
						}

            $scope.elist = [];

            for (var i = 0; i < quake_list.length; i++) {
                item = quake_list[i]["properties"];
                var d = new Date(item['time']);
                var n = d.toISOString();
                $scope.elist.length = 0;
                $scope.elist.push({
                    location: item['place'],
                    time: n,
                    mag: item["mag"],
                    type: item["type"]
                });
                listoutput += "<li>" + item["place"] + " " + item["mag"];
                listoutput += " " + item["type"] + "</li>";
            }

            $scope.$apply();

            // document.getElementById("elist").innerHTML = listoutput;
        }, function errorCallback(response) {
            console.log("test failed");
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }


    $scope.updateText = async function () {
        var checked_left = document.getElementById('option1').checked;
        console.log(checked_left);
        if (checked_left === true) {
            $("#optional_address").show();
            // document.getElementById('optional_address').show();
        } else {
            $("#optional_address").hide();
            // document.getElementById('optional_address').hide();
        }

        // console.log(data);


    }
});

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
//Source: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  // turn into miles
  return d * 0.62137;
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
