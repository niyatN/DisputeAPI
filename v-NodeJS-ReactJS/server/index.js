var express = require('express');
var app = express();
var request = require('request');
var keys = require('./config/keys.js');
var cors = require('cors');
var bodyParser = require('body-parser');
var qs = require('qs');
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json();
app.use(cors())

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
    let bodyResponse =JSON.parse(body);
    access_token = bodyResponse.access_token;
});




// default path
app.get('/',(req, res)=>{
  res.end('index');
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
        // console.log(all_disputes_details.items);
        // res.render('merchant', {dispute_data :all_disputes_details});
        res.json(all_disputes_details);
        
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
        // console.log(all_disputes_details.items);
        // res.render('merchant', {dispute_data :all_disputes_details});
        res.json(all_disputes_details);

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
      // // console.log(dispute_detail.disputed_transactions);
      // console.log(dispute_detail.disputed_transactions[0].buyer)
      // res.render('dispute_detail', {dispute_detail: dispute_detail});
      res.json(dispute_detail);
  });
});



app.get('/get_disputes',(req, res)=>{
  request.get({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes?page_size=50",
    // url : "https://api.sandbox.paypal.com/v1/customer/disputes?page_size=4&next_page_token=AAEuk6wgvBQperLst2wXOTuf2ECQEcGEtES-.00NcBdqvoSoYOLuyXYnCiI02KlsNlMf1onVBuVTeRlq8DmgRlVr4nNgwE3Q7XshaOsPjEjPBg==",
    }, (error, response, body)=>{
      if (!error && response.statusCode == 200) {
        // console.log(body);
        var all_disputes_details = JSON.parse(body);
        res.json(all_disputes_details);
      }
  });
});

// Action
// To send the message to other party
app.post('/send_message', jsonParser,(req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log('My message');
  console.log(req.body.message);
  console.log("https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/send-message");
  request.post({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/send-message",

    json:{"message":req.body.message},
    }, (error, response, body)=>{
      if(response.statusCode==200 && !error){
        console.log(body);
        res.json({'status':200});
      }
      else{
        res.json({'status' :'ERROR'})
      }
  });

});

// To send the message to other party
app.post('/acknowledge_return_item', jsonParser,(req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log('My ack note');
  console.log(req.body.note);
  console.log("https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/acknowledge-return-item");
  request.post({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/acknowledge-return-item",

    json:{"note":req.body.note},
    }, (error, response, body)=>{
        
      console.log(body);
      if(response.statusCode==200 && !error){
        res.json({'status':200});
      }
      else{
        res.json(body)
      }
      
  });

});


app.post('/escalate', jsonParser,(req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log('escalate to paypal note');
  console.log(req.body.note);
  console.log("https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/escalate");
  request.post({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/escalate",

    json:{"note":req.body.escalate_note},
    }, (error, response, body)=>{
      console.log('s');
      if(response.statusCode==200 && !error){
        res.json({'status':200});
      }
      else{
        res.json(JSON.parse(body));
        // throw error;
      }
  });

});

app.post('/make_offer', jsonParser,(req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log(req.body);
  console.log("https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/make-offer");
  request.post({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/make-offer",
    // data:qs.stringify(req.body.body),
    json:req.body.body,
    
    }, (error, response, body)=>{
      console.log(body);
      if(response.statusCode==200 && !error){
        res.json({'status':200});
      }
      else{
        res.json(body);
        // throw error;
      }
  });
});

app.post('/accept_claim', jsonParser,(req, res)=>{
  if(!req.body) return res.sendStatus(400);
  console.log("https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/accept-claim");
  request.post({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+req.body.dispute_id+"/accept-claim",
    // data:qs.stringify(req.body.body),
    json:req.body.body,
    
    }, (error, response, body)=>{
      console.log(body);
      if(response.statusCode==200 && !error){
        res.json({'status':200});
      }
      else{
        res.json(body);
        // throw error;
      }
  });
});



app.get('/compute-metrics', (req, res)=>{
  console.log('aaaaaaaaaaaaaa');
  request.post({
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+access_token
      },
    url: "https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics",
    json : {
      "dimension": "DISPUTE_STATE",
      "measure": "COUNT"
    }, 
  }, (error, response, body)=>{
    if(response.statusCode==200 && !error){
      res.json(body)
      console.log(body);
    }
    else{
    console.log('error');
     console.log(error);
     res.send(error);
    }
  });

})




app.get('/provide-evidence',(req,res)=>{
  const options = {
    "method": "POST",
    "url": "https://api.sandbox.paypal.com/v1/customer/disputes/PP-D-6786/provide-evidence",
    "headers": {
      "Content-Type": "multipart/mixed",
      "Authorization": "Bearer "+access_token,
      // "PayPal-Auth-Assertion": "eyJhbGciOiJub25lIn0=.eyJpc3MiOiJBVmlOY25UbVBhWVozVmx0c21XRU4zVW1vZ0ZjWm5qS3NucWFpdERvMmNIckVFbDFSbG5zNEdTejM2Q1NVbDY5cTllQURKd0VJdFIwUnE3TSIsInBheWVyX2lkIjoiRlNNUkJBTkNWOFBTRyJ9."
    },
    "formData": {
      "input": "{\n  \"evidence_type\": \"PROOF_OF_FULFILLMENT\",\n  \"evidence_info\": {\n  \"tracking_info\": [\n    {\n    \"carrier_name\": \"FEDEX\",\n    \"tracking_number\": \"122533485\"\n    }\n  ]\n  },\n  \"notes\": \"Test\"\n}\n",
      
    }
  };
  
  request(options, (error, response, body) => {
    /* Print the error if one occurred */
    console.log('error:', error);
  
    /* Print the response status code if a response was received */
    console.log('statusCode:', response && response.statusCode);
  
    /* Print the response body */
    console.log('body:', body);
  });
})


app.listen(8000, (err)=>{
    if(err){
        console.log("There is something wrong with connection......");
        throw err;
    }
    console.log("I am ready to Listen");
});




// sudo netstat -plunt |grep :3000
// kill -9 pid