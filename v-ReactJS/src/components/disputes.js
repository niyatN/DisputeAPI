import React,{ Component} from 'react';
import axios from 'axios';
import TimeLine from './timeline';
import Dispute_Detail from './dispute_details';
import CreateDispute from './create_dispute';
import ValidateEliibility from './validate_eligibility';

class Dispute extends Component{
  state = {
    disputes:[],
    divFlag:'timeline', 
    selectdDisputeId:'',
    start_time:'',
    dispute_id:''
  }
  handleDivChange=()=>{
    this.setState({divFlag:1})
  }
  // handleClick=(e)=>{
  //   this.setState({selectdDisputeId:dispute.dispute_id});
  //   this.setState({divFalg:1});
  // }
  // onClick={(e)=>this.setState({selected:book.id})}
  handleSubmit=(e)=>{
    e.preventDefault();
    
  }
  componentDidMount(){
    var url ='';
    console.log(this.props);
    if(this.props.match.params.start_time){
      axios({
        method:'get',
        headers: {
          "content-type" : "application/json",
          "Authorization": "Bearer "+sessionStorage.getItem('access_token')
          },
          url: "https://api.sandbox.paypal.com/v1/customer/disputes?start_time="+this.props.match.params.start_time+"T00:00:00.000Z",
      })
      .then(res =>{
        this.setState({
          disputes:res.data.items
        })
      })
      .catch((err)=>{
        throw err;
      })
    }
    else if(this.props.match.params.dispute_id){
      console.log('I am from id');
      axios({
        method:'get',
        headers: {
          "content-type" : "application/json",
          "Authorization": "Bearer "+sessionStorage.getItem('access_token')
          },
        url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+this.props.match.params.dispute_id,
      })
      .then((res) =>{
        this.setState({disputes:[res.data]})
      
      })
      .catch((err)=>{
        throw err;
      })
    }
    else{
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
      console.log(res.data);
      })
      .catch((err)=>{
        throw err;
      })
    }
    
  }
  render(){
    const {disputes} = this.state;
    console.log(this.state);
    const disputeList = disputes.length?(
      disputes.map(dispute =>{
        return(
          
            <div className={"card z-depth-3 col l6 m12 s12 dispute_summary "  +dispute.status} key={dispute.dispute_id} onClick={(e)=>this.setState({selectdDisputeId:dispute.dispute_id, divFlag:'dispute_details'})}>
              <div className="card-content">
              {/* <Link to ={'/dispute_id/'+dispute.dispute_id} onClick = {()=>this.handleDivChange()}>
                <span className="card-title">{dispute.dispute_id}</span>
              </Link> */}
                <span className="card-title">{dispute.dispute_id}</span>
                <p>{dispute.status}</p>
                <p className = "dispute_reason"> {dispute.reason}</p>
                <p><b>Create time</b> : {dispute.create_time.slice(0,10)}</p>
                <p><b>Update time </b>: {dispute.update_time.slice(0,10)}</p>
                <p><b>Dispute amount: {dispute.dispute_amount.value} {dispute.dispute_amount.currency_code} </b></p>
              </div>
            </div> 
          
        )
      })
    ):(
      <div className ="center"><h3>No Disputes...</h3></div>
    )
    return(
      <div>
      <div className=" row">
      
        <div className = "card col s12 l7 m12">
        <div className = "card-content">
        <div className="row">
          <span className="card-title">Disputes</span>
          <button class="waves-effect waves-light btn" onClick={(e)=>this.setState({ divFlag:'create_dispute'})}>Create Dispute</button>
          <button class="waves-effect waves-light btn" onClick={(e)=>this.setState({ divFlag:'validate_eligibility'})}>Validate Eligibility</button>
        </div>
          <div className="row">
            <form onSubmit={this.handleSubmit}>

            </form>
          </div>
          {disputeList}
        </div>
        </div>
        <div className = "card col s12 l5 m12 ">
        {
          (this.state.divFlag=='timeline')?(
          <div className = "card-content">
          <span className="card-title">TimeLine</span>
            <TimeLine disputes={this.state.disputes} />
          </div>
          ):(
            null
          )
        }
        {
          (this.state.divFlag==='dispute_details')?(
            <Dispute_Detail dispute_id={this.state.selectdDisputeId}/>
            ):(
              null
            )
        }
        {
          (this.state.divFlag==='create_dispute')?(
            <CreateDispute />
            ):(
              null
            )
        }
        {
          (this.state.divFlag==='validate_eligibility')?(
            <ValidateEliibility />
          ):(
            null
          )
        }
        </div>
      </div>
      </div>
    )
  }
}
export default Dispute;
