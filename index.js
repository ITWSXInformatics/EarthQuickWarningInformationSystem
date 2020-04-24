const express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

const app = express();
const port = 3000;
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

app.get('/', (req, res) => res.sendfile('index.html'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


//API developments goes here

app.post("/search",(req,res)=>{
	console.log(req.body);

	//get how many hours ago the time frame is
	var hoursAgo = req.body["timeDistance"];
	
	//get the current time and subtract the entered amount of hours
	var timeFrame = new Date();
	timeFrame.setHours(timeFrame.getHours() - hoursAgo);
	
	//format the string to something like this 2020-04-23T23:34:20.536Z
	stringTime = timeFrame.toISOString();
	
	//message for API call
	var msgPath = "/fdsnws/event/1/query?format=geojson&";
	
	//Add time query
	msgPath += "starttime=" + stringTime;

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
			console.log('BODY: ' + retInfo["features"][0]["properties"]["place"]);
		});
	}).end();


	res.send("good bye and good night");

});

app.get("api/address",(req,res)=>{


});


app.get("api/address2",(req,res)=>{


});


app.get("api/address3",(req,res)=>{


});
