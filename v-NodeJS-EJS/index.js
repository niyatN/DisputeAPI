var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var keys = require('./config/keys.js');
var request = require('request');
// const JSON = require('json');

app.use('/assets',express.static('assets'));
app.set('view engine','ejs');

// to get access token

var access_token="";
request.post({
  headers: {
    "content-type" : "application/x-www-form-urlencoded",
    "Authorization":keys.authorization.Authorization_key
    },
  url: "https://api.sandbox.paypal.com/v1/oauth2/token",
  body: "grant_type=client_credentials"
  }, (err, res, body)=>{
    if(err) {
      throw err;
    }
    console.log(body);
    // console.log(body);
    let bodyResponse =JSON.parse(body);
    access_token = bodyResponse.access_token;
    console.log("Access Token: "+access_token);
});




// default paath
app.get('/',(req, res)=>{
  res.render('index');
});



//to get all the disputes with start time 
app.get('/get_disputes_bystarttime',(req, res)=>{
  console.log(req.query.start_time);
  request.get({
    headers: {
      "content-type" : "application/json",
      // "start_time":req.query.start_time+"T00:00:00.000Z",
      "Authorization": "Bearer "+access_token,
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes?start_time="+req.query.start_time+"T00:00:00.000Z",
    }, (error, response, body)=>{
      if (!error && response.statusCode == 200) {
        var all_disputes_details = JSON.parse(body);
        console.log(all_disputes_details.items);
        res.render('merchant', {dispute_data :all_disputes_details});
      } 
  })

});

app.get('/get_disputes_by_state',(req, res)=>{
  console.log(req.query.dispute_state);
  request.get({
    headers: {
      "content-type" : "application/json",
      // "start_time":req.query.start_time+"T00:00:00.000Z",
      "Authorization": "Bearer "+access_token,
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes?dispute_state="+req.query.dispute_state,
    }, (error, response, body)=>{
      if (!error && response.statusCode == 200) {
        var all_disputes_details = JSON.parse(body);
        console.log(all_disputes_details.items);
        res.render('merchant', {dispute_data :all_disputes_details});
      } 
  })
});

//for particular dispute pass
// pass id
app.get('/get_dispute_detail',(req, res)=>{
  request.get({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+req.query.dispute_id,
    }, (err, response, body)=>{
      if(err) {throw err;}
      let dispute_detail = JSON.parse(body);
      console.log(dispute_detail);
      // console.log(dispute_detail.disputed_transactions);
      console.log(dispute_detail.disputed_transactions[0].buyer)
      res.render('dispute_detail', {dispute_detail: dispute_detail});
  });
});



app.get('/get_disputes',(req, res)=>{
  request.get({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes",
    }, (error, response, body)=>{
      if (!error && response.statusCode == 200) {
        var all_disputes_details = JSON.parse(body);
        console.log(all_disputes_details.items);
        res.render('merchant', {dispute_data :all_disputes_details});
      }
  });
});






app.listen(3000, (err)=>{
    if(err){
        console.log("There is something wrong with connection......");
        throw err;
    }
    console.log("I am ready to Listen");
});

