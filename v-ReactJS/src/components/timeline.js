import React, { Component } from 'react';
import {Chart} from 'react-google-charts';
import axios from 'axios';

class TimeLine extends Component {
  state={
    disputes:[],
    data:[],
    pieData:[
      ['OPEN',0],
      ['WAITING_FOR_SELLER_RESPONSE', 0],
      ['WAITING_FOR_BUYER_RESPONSE', 0],
      ['UNDER_REVIEW', 0],
      ['RESOLVED',0],
      ['OTHER', 0]
    ],
    OPEN:0,
    WAITING_FOR_SELLER_RESPONSE:0,
    WAITING_FOR_BUYER_RESPONSE:0,
    UNDER_REVIEW:0,
    RESOLVED:0,
    OTHER:0

    
  }
  
  componentDidMount(){

    // for timeline
    axios({
      method:'get',
      headers: {
        "content-type" : "application/json",
        "Authorization": "Bearer "+sessionStorage.getItem('access_token')
        },
      url: "https://api.sandbox.paypal.com/v1/customer/disputes?page_size=50",
    })
    .then(res =>{
      this.setState({
        disputes:res.data.items
      })
    // console.log('Result in dispute:'+res.data.items);
      console.log(this.state.disputes);
      var l =[[
        { type: 'string', id: 'Position' },
        { type: 'string', id: 'Name' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' },
      ]];
      
      for(var i=0;i<this.state.disputes.length;i++){

        l.push([this.state.disputes[i].dispute_id,'a',new Date(this.state.disputes[i].create_time) , new Date(this.state.disputes[i].update_time)]);
        if(this.state.disputes[i].status!="RESOLVED"){
          l.push([this.state.disputes[i].dispute_id,'b', new Date(this.state.disputes[i].update_time),new Date()]);
        }

      }
      this.setState({data:l});
    })
    .catch((err)=>{
      throw err
    })
    

    // axios({
    //   method:'post',
    //   headers: {
    //     "content-type" : "application/json",
    //     "Authorization": "Bearer "+sessionStorage.getItem('access_token')
    //     },
    //   url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics',
    //   data:{
    //     dimension: 'STATUS',
    //     measure: 'COUNT'
    //   }
    // })
    // .then((res)=>{
    //   console.log('aaa');
    //   console.log(res.data);
    // })
    // .catch((err)=>{
    //   // console.log(sessionStorage.getItem('access_token'));
    //   console.log(err.response)
    // })
      
  }
    render(){
      const {data} = this.state;
      
      const TimeLineGraph = data.length?(
        <Chart
            width={'100%'}
            height={'35em'}
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
              timeline: { colorByRowLabel: false },
              // Just add this option
            }}
          />
      ):(
        
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    
      )
    return(
      <div>
      <div className="row">
      
        <div className = "col s12">
        {
          TimeLineGraph
        }
        
        </div>
      </div>
      
      </div>
    )
  }
}


export default TimeLine;
