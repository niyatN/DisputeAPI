import React,{ Component} from 'react';
import axios from 'axios';
import TimeLine from './timeline';
import {Link} from 'react-router-dom';
import Dispute_Detail from './dispute_details';

class Dispute extends Component{
  state = {
    disputes:[],
    divFlag:0,
    selectdDisputeId:''
  }
  handleChange=()=>{
    this.setState({divFlag:1})
  }
  // handleClick=(e)=>{
  //   this.setState({selectdDisputeId:dispute.dispute_id});
  //   this.setState({divFalg:1});
  // }
  // onClick={(e)=>this.setState({selected:book.id})}
  componentDidMount(){
    var url ='';
    console.log(this.props);
    if(this.props.match.params.start_time){
      // console.log(this.props.match.params.start_time);
      url = 'http://localhost:4000/get_disputes_bystarttime?start_time='+this.props.match.params.start_time;
      console.log(url);

      axios.get(url)
      .then(res =>{
      this.setState({
        disputes:res.data.items
      })
      console.log('Result in dispute:'+res.data.items);
    })
    }
    else if(this.props.match.params.dispute_id){
      url = 'http://localhost:4000/get_dispute_detail?dispute_id='+this.props.match.params.dispute_id;
      console.log(url);
      axios.get(url)
     .then(res =>{
      this.setState({
        disputes:[res.data]
      })
      console.log('Result in dispute:'+this.state.disputes[0].dispute_id);
    })
    }
    else{
      url = 'http://localhost:4000/get_disputes';
      axios.get(url)
      .then(res =>{
      this.setState({
        disputes:res.data.items
      })
      console.log('Result in dispute:'+res.data.items);
    })
    }
    
  }
  render(){
    const {disputes} = this.state;
    console.log(this.state);
    const disputeList = disputes.length?(
      disputes.map(dispute =>{
        return(
          
            <div className={"card z-depth-3 col l6 m12 s12 dispute_summary "  +dispute.status} key={dispute.dispute_id} onClick={(e)=>this.setState({selectdDisputeId:dispute.dispute_id, divFlag:1})}>
              <div className="card-content">
              {/* <Link to ={'/dispute_id/'+dispute.dispute_id} onClick = {()=>this.handleChange()}>
                <span className="card-title">{dispute.dispute_id}</span>
              </Link> */}
                <span className="card-title">{dispute.dispute_id}</span>
                <p>{dispute.status}</p>
                <p>Create time : {dispute.create_time.slice(0,10)}</p>
                <p>Update time : {dispute.update_time.slice(0,10)}</p>
                <p><b>Dispute amount : {dispute.dispute_amount.value} {dispute.dispute_amount.currency_code} </b></p>
              </div>
            </div> 
          
        )
      })
    ):(
      <div className ="center"><h3>No Dispute</h3></div>
    )
    return(
      <div>
      <div className=" row">
      
        <div className = "card col s12 l7 m12">
        <div className = "card-content">
        <span className="card-title">Disputes</span>
          {disputeList}
        </div>
        </div>
        <div className = "card col s12 l5 m12 ">
        {
          (this.state.divFlag==0)?(
          <div className = "card-content">
          <span className="card-title">TimeLine</span>
            <TimeLine disputes={this.state.disputes} />
          </div>
          ):(
            <Dispute_Detail dispute_id={this.state.selectdDisputeId}/>
          )
        }
        </div>
      </div>
      </div>
    )
  }
}
export default Dispute;
