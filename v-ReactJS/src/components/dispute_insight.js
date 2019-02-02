import React, { Component } from 'react';
import {Chart} from 'react-google-charts';
import axios from 'axios';

class DisputeInsight extends Component {
  state = {
      status_data:null,
      dimension:"STATUS",
      measure:"COUNT",
      statuses:[],
      reasons:[],
      update_time_before:"",
      update_time_after:"",
      create_time_before:"",
      create_time_after:"",
      response_due_date_before:"",
      response_due_date_after:"",
      DISPUTE_AMOUNT_SUM_data:null,
      TRANSACTION_AMOUNT_SUM_data:null,
      REFUND_AMOUNT_SUM_data:null
  }  
  componentDidMount(){
    // let data = {};
    // data.dimension = "STATUS";
    // data.measure = "COUNT";
    // console.log(data);
    // axios({
    //   method:'post',
    //   headers: {
    //     "content-type" : "application/json",
    //     "Authorization": "Bearer "+sessionStorage.getItem('access_token')
    //     },
    //   url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics?advanced=true',
    //   data:data
    // })
    // .then((res)=>{
    //   console.log('sdd');
    //   console.log(res.data);
    //   let status_data = [['DISPUTE_STATE', 'Count']]
    //   res.data.metrics.map((i)=>{
    //       status_data.push([i.key, i.count])
    //     });
    //   this.setState({status_data:status_data});
    // })
    // .catch((err)=>{
    //   // console.log(sessionStorage.getItem('access_token'));
    //   console.log(err.response)
    // })
  }
    handleCheckbox = (e)=>{
      let l = this.state[e.target.id];
      // let l =[]
      let index = l.indexOf(e.target.value)
      if(index==-1){
        l.push(e.target.value)
      }
      else{
        l.splice(index, 1);
      }
      this.setState({[e.target.id]:l}, ()=>{console.log(this.state)})
      
    }
    handleChange=(e)=>{
      this.setState({[e.target.id]:e.target.value},
        ()=>{
          console.log(this.state);
        });
    }
    handleSubmit=(e)=>{
      e.preventDefault();
      let data = {};
      let filter = {};
      let isFilter = 0;
      if(this.state.name){
        filter.name=this.state.name;
        isFilter=1
      }
      if(this.state.email){
        filter.email=this.state.email
        isFilter=1
      }
      if(this.state.update_time_after){
        filter.update_time_after=this.state.update_time_after+'T00:00:00.000Z'
        isFilter=1
      }
      if(this.state.update_time_after){
        filter.update_time_after=this.state.update_time_after+'T00:00:00.000Z'
        isFilter=1
      }
      if(this.state.create_time_before){
        filter.create_time_before=this.state.create_time_before+'T01:00:00.000Z'
        isFilter=1
      }
      if(this.state.create_time_after){
        filter.create_time_after=this.state.create_time_after+'T01:00:00.000Z'
        isFilter=1
      }
      if(this.state.response_due_date_before){
        filter.response_due_date_before=this.state.response_due_date_before+'T00:00:00.000Z'
        isFilter=1
      }
      if(this.state.response_due_date_after){
        filter.response_due_date_after=this.state.response_due_date_after+'T00:00:00.000Z'
        isFilter=1
      }
      if(this.state.statuses.length!==0){
        let s=""
        isFilter=1
        let l = this.state.statuses
        s +=l[0]
        let length = l.length
        for(var i=1; i<length; i++){
          s += ","
          s += l[i]
        }
        filter.statuses= s;
        console.log(s)
      }
      if(this.state.reasons.length!==0){
        isFilter=1
        let l = this.state.reasons
        let s= ""
        s +=l[0]
        let length = l.length
        for(var i=1; i<length; i++){
          s += ","
          s += l[i]
        }
        filter.reasons= s;
      }
/////////////////////////////////////////////////////
      
      
      if(isFilter==1){
        const dispute_amount_gte={}
        const dispute_amount_lte={}
        dispute_amount_lte.value="100000000"
        dispute_amount_gte.value="0"
        dispute_amount_lte.currency_code="USD"
        dispute_amount_gte.currency_code="USD"
        filter.dispute_amount_gte = dispute_amount_gte
        filter.dispute_amount_lte = dispute_amount_lte
        data.filter=filter;

      }
      data.dimension = this.state.dimension;
      data.measure = "COUNT";
        console.log(data);
        axios({
          method:'post',
          headers: {
            "content-type" : "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem('access_token')
            },
          url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics?advanced=true',
          data:data
        })
        .then((res)=>{
          console.log('sdd');
          console.log(res.data);
          let status_data = [[this.state.dimension, 'Count']]
          res.data.metrics.map((i)=>{
              status_data.push([i.key, i.count])
            });
          this.setState({status_data:status_data});
        })
        .catch((err)=>{
          // console.log(sessionStorage.getItem('access_token'));
          console.log(err.response)
        })

///////////////////////////////////////////////////////
        let data2 = {};
        data2.dimension = this.state.dimension;
        data2.measure = "DISPUTE_AMOUNT_SUM";
        if(isFilter==1){
          const dispute_amount_gte={}
          const dispute_amount_lte={}
          dispute_amount_lte.value="10000000"
          dispute_amount_gte.value="0"
          dispute_amount_lte.currency_code="USD"
          dispute_amount_gte.currency_code="USD"
          filter.dispute_amount_gte = dispute_amount_gte
          filter.dispute_amount_lte = dispute_amount_lte
          data2.filter=filter;
  
        }
        console.log(data2);
        axios({
          method:'post',
          headers: {
            "content-type" : "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem('access_token')
            },
          url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics?advanced=true',
          data:data2
        })
        .then((res)=>{
          console.log('sdd');
          console.log(res.data);
          let DISPUTE_AMOUNT_SUM_data = [[this.state.dimension,'USD']]        
          res.data.metrics.map((i)=>{
            DISPUTE_AMOUNT_SUM_data.push([i.key,parseFloat(i.amount[0].value)||0 ])
          })
          this.setState({DISPUTE_AMOUNT_SUM_data:DISPUTE_AMOUNT_SUM_data},()=>{
            console.log(this.state.DISPUTE_AMOUNT_SUM_data)
          });
          
        })
        .catch((err)=>{
          console.log(err.response)
          alert(err.response.data.details[0].issue)
        })
        
        ////////////////////////////////////////////////
        let data3 = {};
        data3.dimension = this.state.dimension;
        
        if(isFilter==1){
          const dispute_amount_gte={}
          const dispute_amount_lte={}
          dispute_amount_lte.value="1000000"
          dispute_amount_gte.value="0"
          dispute_amount_lte.currency_code="USD"
          dispute_amount_gte.currency_code="USD"
          filter.dispute_amount_gte = dispute_amount_gte
          filter.dispute_amount_lte = dispute_amount_lte
          data3.filter=filter;
  
        }
        data3.measure = "TRANSACTION_AMOUNT_SUM";
        console.log(data2);
        axios({
          method:'post',
          headers: {
            "content-type" : "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem('access_token')
            },
          url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics?advanced=true',
          data:data3
        })
        .then((res)=>{
          console.log('sdd');
          console.log(res.data);
          let TRANSACTION_AMOUNT_SUM_data = [[this.state.dimension,'USD']]
          // let titles = []
          // res.data.metrics.map((i)=>{
          //     i.amount.map((j)=>{
          //       if(!titles.includes(j.currency_code)){
          //         titles.push(j.currency_code)
          //       }
          //     })
          // });
          // DISPUTE_AMOUNT_SUM_data.push(titles)
          
          res.data.metrics.map((i)=>{
            TRANSACTION_AMOUNT_SUM_data.push([i.key,parseFloat(i.amount[0].value) ||0])
          })
          this.setState({TRANSACTION_AMOUNT_SUM_data:TRANSACTION_AMOUNT_SUM_data});
          console.log(this.state.TRANSACTION_AMOUNT_SUM_data)
        })
        .catch((err)=>{
          // console.log(sessionStorage.getItem('access_token'));
          console.log(err.response)
        })
//////////////////////////////////////////////////
        let data4 = {};
        data4.dimension = this.state.dimension;
        
        if(isFilter==1){
          const dispute_amount_gte={}
          const dispute_amount_lte={}
          dispute_amount_lte.value="1000000"
          dispute_amount_gte.value="0"
          dispute_amount_lte.currency_code="USD"
          dispute_amount_gte.currency_code="USD"
          filter.dispute_amount_gte = dispute_amount_gte
          filter.dispute_amount_lte = dispute_amount_lte
          data4.filter=filter;
  
        }
        data4.measure = "REFUND_AMOUNT_SUM";
        axios({
          method:'post',
          headers: {
            "content-type" : "application/json",
            "Authorization": "Bearer "+sessionStorage.getItem('access_token')
            },
          url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics?advanced=true',
          data:data4
        })
        .then((res)=>{
          console.log('gdgdgdgsdd');
          
          let REFUND_AMOUNT_SUM_data = [[this.state.dimension,'USD']]
          
          res.data.metrics.map((i)=>{
            if(i.amount){
              REFUND_AMOUNT_SUM_data.push([i.key,parseFloat(i.amount[0].value)])
            }
            else{
              REFUND_AMOUNT_SUM_data.push([i.key,0])
            }
            
          })
          this.setState({REFUND_AMOUNT_SUM_data:REFUND_AMOUNT_SUM_data},()=>{
            console.log(this.state.REFUND_AMOUNT_SUM_data)
          });
          
        })
        .catch((err)=>{
          // console.log(sessionStorage.getItem('access_token'));
          console.log(err.response)
        })
/////////////////////////////////////////////////
        // let data5 = {};
        // data5.dimension = this.state.dimension;
        
        // if(isFilter==1){
        //   const dispute_amount_gte={}
        //   const dispute_amount_lte={}
        //   dispute_amount_lte.value="1000000"
        //   dispute_amount_gte.value="0"
        //   dispute_amount_lte.currency_code="USD"
        //   dispute_amount_gte.currency_code="USD"
        //   filter.dispute_amount_gte = dispute_amount_gte
        //   filter.dispute_amount_lte = dispute_amount_lte
        //   data5.filter=filter;
  
        // }
        // data5.measure = "DISPUTE_AMOUNT_SUM";
        // console.log(data5);
        // axios({
        //   method:'post',
        //   headers: {
        //     "content-type" : "application/json",
        //     "Authorization": "Bearer "+sessionStorage.getItem('access_token')
        //     },
        //   url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics?advanced=true',
        //   data:data5
        // })
        // .then((res)=>{
        //   console.log('sdd');
        //   console.log(res.data);
        //   let TRANSACTION_AMOUNT_SUM_data = [[this.state.dimension,'USD']]
        //   // let titles = []
        //   // res.data.metrics.map((i)=>{
        //   //     i.amount.map((j)=>{
        //   //       if(!titles.includes(j.currency_code)){
        //   //         titles.push(j.currency_code)
        //   //       }
        //   //     })
        //   // });
        //   // DISPUTE_AMOUNT_SUM_data.push(titles)
          
        //   res.data.metrics.map((i)=>{
        //     TRANSACTION_AMOUNT_SUM_data.push([i.key,parseFloat(i.amount[0].value) ||0])
        //   })
        //   this.setState({TRANSACTION_AMOUNT_SUM_data:TRANSACTION_AMOUNT_SUM_data});
        //   console.log(this.state.TRANSACTION_AMOUNT_SUM_data)
        // })
        // .catch((err)=>{
        //   // console.log(sessionStorage.getItem('access_token'));
        //   console.log(err.response)
        // })
///////////////////////////////////////////////////////////

    }
    render(){

        const form = ()=>{
          return(
            <div className="row">
              <form onSubmit={this.handleSubmit}>
              <div className="col s4">
                <label htmlFor="dimention">Dimension</label>
                  <select value={this.state.dimension} id="dimension"className="browser-default" onChange={this.handleChange}>
                    <option value="STATUS">Status</option>
                    <option value="REASON">Dispute Reason</option>
                    <option value="DISPUTE_STATE">Dispute State </option>
                    <option value="DISPUTE_OUTCOME">Dispute Outcome</option>
                  </select>

                  
                  {/* <div className="input-field col s6">
                    <input id="mo_invoice_id" type="date" onChange={this.handleChange} />
                    <label htmlFor="mo_invoice_id">Invoice Id</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="mo_invoice_id" type="date" onChange={this.handleChange} />
                    <label htmlFor="mo_invoice_id">Invoice Id</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="mo_invoice_id" type="date" onChange={this.handleChange} />
                    <label htmlFor="mo_invoice_id">Invoice Id</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="mo_invoice_id" type="date" onChange={this.handleChange} />
                    <label htmlFor="mo_invoice_id">Invoice Id</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="mo_invoice_id" type="date" onChange={this.handleChange} />
                    <label htmlFor="mo_invoice_id">Invoice Id</label>
                  </div>
                  <div className="input-field col s6">
                    <input id="mo_invoice_id" type="date" onChange={this.handleChange} />
                    <label htmlFor="mo_invoice_id">Invoice Id</label>
                  </div> */}
                  
                  <div className="input-field col s6">
                    <p>Update time before</p>
                    <input id="update_time_before" type="date"  onChange = {this.handleChange} />
                  </div>

                  
                  <div className="input-field col s6">
                    <p>Update time after</p>
                    <input id="update_time_after" type="date"  onChange = {this.handleChange} />
                  </div>

                  
                  <div className="input-field col s6">
                    <p>create the before</p>
                    <input id="create_time_before" type="date" className="datepicker" required="required" onChange = {this.handleChange} />
                  </div>

                  
                  <div className="input-field col s6">
                  <p>create time after</p>
                    <input id="create_time_after" type="date" className="datepicker" required="required" onChange = {this.handleChange} />
                  </div>
                  
                  <div className="input-field col s6">
                  <p>response due date before</p>
                    <input id="response_due_date_before" type="date" className="datepicker" required="required" onChange = {this.handleChange} />
                  </div>
                  
                  <div className="input-field col s6">
                  <p>rersponse due date after</p>
                    <input id="response_due_date_after" type="date" className="datepicker" required="required" onChange = {this.handleChange} />
                  </div>
              </div>
              <div className="col s4">

              <div className="input-field">
                <input id="name"  type="text"  onChange={this.handleChange}  />
                  <label htmlFor="name">Name</label>
              </div>
              <div className="input-field">
                <input id="email"  type="email"  onChange={this.handleChange}  />
                  <label htmlFor="email">Email</label>
              </div>
              <p>
                  <label>
                    <input type="checkbox" id="statuses" onChange={this.handleCheckbox} value="OPEN"/>
                    <span>OPEN</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="statuses" onChange={this.handleCheckbox} value="RESOLVED"/>
                    <span>RESOLVED</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="statuses" onChange={this.handleCheckbox} value="UNDER_REVIEW" />
                    <span>UNDER_REVIEW</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="statuses" onChange={this.handleCheckbox} value="WAITING_FOR_SELLER_RESPONSE"/>
                    <span>WAITING_FOR_SELLER_RESPONSE</span>
                  </label>
                </p>
                
                <p>
                  <label>
                    <input type="checkbox" id="statuses" onChange={this.handleCheckbox} value="WAITING_FOR_BUYER_RESPONSE"/>
                    <span>WAITING_FOR_BUYER_RESPONSE</span>
                  </label>
                </p>
              </div>

              {/* For Reasons */}
              <div className="col s4">
              <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED"/>
                    <span>MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="MERCHANDISE_OR_SERVICE_NOT_RECEIVED"/>
                    <span>MERCHANDISE_OR_SERVICE_NOT_RECEIVED</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="INCORRECT_AMOUNT" />
                    <span>INCORRECT_AMOUNT</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="CREDIT_NOT_PROCESSED"/>
                    <span>CREDIT_NOT_PROCESSED</span>
                  </label>
                </p>
                
                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="DUPLICATE_TRANSACTION"/>
                    <span>DUPLICATE_TRANSACTION</span>
                  </label>
                </p>

                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="PAYMENT_BY_OTHER_MEANS"/>
                    <span>PAYMENT_BY_OTHER_MEANS</span>
                  </label>
                </p>

                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="CANCELED_RECURRING_BILLING"/>
                    <span>CANCELED_RECURRING_BILLING</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="UNAUTHORISED"/>
                    <span>UNAUTHORISED</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input type="checkbox" id="reasons" onChange={this.handleCheckbox} value="OTHER"/>
                    <span>OTHER</span>
                  </label>
                </p>
                
              </div>
              <div className="row offset-s9 col s2">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Submit</button>
                </div>
              </form>
            </div>
          )
        }

        return(
          <div className="row">
          {
            form()
          }
          {
            (this.state.status_data)?
            (
              <div>

              <div className="row">
                <div className = "card col s12 m12 l6 z-depth-6">
                    <Chart
                        width={'600px'}
                        height={'350px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={this.state.status_data}
                        options={{
                        title: 'Count',
                        // Just add this option
                        pieHole: 0.4,
                        }}
                    />
                </div>
                <div className = "card col s12 m12 l6 z-depth-1">
                    <Chart
                        width={'600px'}
                        height={'350px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={this.state.DISPUTE_AMOUNT_SUM_data}
                        options={{
                            // Material design options
                            chart: {
                            title: 'Dispute Amount sum',
                            // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                        }}
                        />
                </div>
                <div className = "card col s12 m12 l6 z-depth-1">
                <Chart
                        width={'600px'}
                        height={'350px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={this.state.TRANSACTION_AMOUNT_SUM_data}
                        options={{
                        title: 'Transaction Amount',
                        // Just add this option
                        pieHole: 0.4,
                        }}
                    />
                </div>

                <div className = "card col s12 m12 l6 z-depth-1">
                    <Chart
                        width={'600px'}
                        height={'350px'}
                        chartType="Bar"
                        loader={<div>Loading Chart</div>}
                        data={this.state.REFUND_AMOUNT_SUM_data}
                        options={{
                            // Material design options
                            chart: {
                            title: 'Refund Amount sum',
                            // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                            },
                        }}
                        />
                </div>
        
        </div>
        

    </div>
    ):
            (<div>
              <h4> Loading.... </h4>
              <div className="progress">
                  <div className="indeterminate"></div>
              </div>
          </div>)
    }
            
        </div>

        )
    }
}


export default DisputeInsight;

