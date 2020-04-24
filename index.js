const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fetch = require('isomorphic-fetch');
var cors = require('cors');

const app = express();
const port = 6000;
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

//API developments goes here

app.post("/search",(req,res)=>{
    console.log(req.body);

    //use usgs api here, and return data


    res.send("good bye and good night");

});

app.get("api/address",(req,res)=>{


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


app.get("api/address3",(req,res)=>{


});
