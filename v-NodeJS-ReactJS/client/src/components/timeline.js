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
    axios.get('http://localhost:4000/get_disputes')
    .then(res =>{
      // console.log(res);
      this.setState({
        disputes:res.data.items
      });
      
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
      console.log(l);
    })
      
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
      <Chart
  width={'500px'}
  height={'300px'}
  chartType="PieChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Task', 'Hours per Day'],
    ['Work', 11],
    ['Eat', 2],
    ['Commute', 2],
    ['Watch TV', 2],
    ['Sleep', 7],
  ]}
  options={{
    title: 'Dispute Status',
    // Just add this option
    pieHole: 0.4,
  }}
  />
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
