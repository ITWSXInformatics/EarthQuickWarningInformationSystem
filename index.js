const express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var path = require('path');
var fetch = require('isomorphic-fetch');
var cors = require('cors');

require('dotenv').config();

const http = require('http');
const querystring = require('querystring');


const app = express();
const port = 6789;


app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());

app.use("/", express.static(__dirname)); 



app.get('/', function (req, res) { 

	// res.redirect('/');
	console.log(req);
	res.sendfile('./index.html');

});



const server = http.createServer(app);

server.listen(port);



// app.listen(port, 'localhost');

async function get_earthquake_list_by_timestamp(start_time, end_time){

  var usgs_url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=';
  usgs_url += start_time;
  usgs_url += "&endtime=";
  usgs_url += end_time;
  var result = await fetch(usgs_url, {
        method: 'GET'
    })

    let ret = await result.json();
    return ret;
}


async function geocode_address(address){
	var base_url = "https://api.tomtom.com/search/2/geocode/";
	//.json?key=
	base_url += querystring.escape(address);
	base_url += ".json?key=";
	base_url += process.env.GEOCODING_API_KEY;
	var result = await fetch(base_url, {
        method: 'GET'
    });

    let ret = await result.json();
    return ret;

}




//API developments goes here

app.post("/search",async function (req,res_search){
	console.log(req.body);

	//message for API call
	var msgPath = "/fdsnws/event/1/query?format=geojson";

	//get how many hours ago the time frame is
	if("timeDistance" in req.body){
		var hoursAgo = req.body["timeDistance"];

		//get the current time and subtract the entered amount of hours
		var timeFrame = new Date();
		timeFrame.setHours(timeFrame.getHours() - hoursAgo);
			

		//format the string to something like this 2020-04-23T23:34:20.536Z
		var stringTime = timeFrame.toISOString();

		//Add time query
		msgPath += "&starttime=" + stringTime;


	}

	var latitude = "";
	var longitude = "";

	if("address" in req.body && "radius" in req.body){

		var radius = req.body["radius"];
		msgPath += "&maxradiuskm=" + radius;



		if("latitude" in req.body && "longitude" in req.body
			&& req.body["latitude"] != "" && req.body["longitude"] != ""){
			var latitude = req.body["latitude"];
			var longitude = req.body["longitude"];
			msgPath += ("&longitude=" + longitude);
			msgPath += ("&latitude=" + latitude);
		}else{

			var address = req.body["address"];
			var geocode_result = await geocode_address(address);
			// console.log("=====",geocode_result);
			try {
			    // console.log("geocode_result['summary']['numResults']:",geocode_result['summary']['numResults']);
			    if(geocode_result['summary']['numResults']>0){
                    var latitude = geocode_result["results"][0]["position"]["lat"];
                    var longitude = geocode_result["results"][0]["position"]["lon"];
                    msgPath += ("&longitude=" + longitude);
                    msgPath += ("&latitude=" + latitude);
                }else{
			        res_search.status(201).send("invalid address");
			        return;
                }
			}catch(err){
				 console.error("Error:", err);
		        latitude = "";
		        longitude = "";
			}
		}

		console.log("LAT");
		console.log(latitude);
		console.log("LON");
		console.log(longitude);


	}


	if("magnitude" in req.body){
		var magnitude = req.body["magnitude"];
		msgPath += "&minmagnitude=" + magnitude;
	}

	console.log(msgPath);

	//use usgs api here, and return data
	
	//options to send in the REST API request
	var options = {
		host: "earthquake.usgs.gov",
		port: 443,
		path: msgPath,
		method: 'GET'
	};

	// Make the API request and log the information recieved
	https.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (ret) {
			var retInfo = JSON.parse(ret);
			// Just log the location of the earthquake at the 0th index
			if(retInfo["metadata"]['count'] > 0){
				console.log('BODY: ' + retInfo["features"][0]["properties"]["place"]);
				console.log(retInfo["features"][0]["properties"])
			}
			console.log(retInfo);
			
			res_search.send({"latitude": latitude, "longitude": longitude, "quake_list": retInfo});
			return;
		});

		
	}).on('error', (e) => {
  		res_search.send({"latitude": latitude, "longitude": longitude, "quake_list": ""});

	}).end();


	// res_search.send({"latitude": latitude, "longitude": longitude, "quake_list": []});

});



//Example to test:
//curl -X POST 'http://localhost:6000/api/timeframe' -H "accept: */*" -H "Content-Type: application/json" -d "{\"start_time\": \"2014-01-01\", \"end_time\": \"2014-01-02\"}"

app.post("/api/timeframe",async (req,res)=>{
	 console.log(req.body);

	 // console.log(chunk);
	 var start_time = req.body.start_time;
	 var end_time = req.body.end_time;
	 console.log(start_time);
	 console.log(end_time);
	 var earthquake_list = await get_earthquake_list_by_timestamp(start_time, end_time);
	 console.log(earthquake_list);
	 res.send(JSON.stringify({"eq_list": earthquake_list}));


});
