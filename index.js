const express = require('express');
var bodyParser = require('body-parser');

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

    //use usgs api here, and return data


    res.send("good bye and good night");

});

app.get("api/address",(req,res)=>{


});


app.get("api/address2",(req,res)=>{


});


app.get("api/address3",(req,res)=>{


});
