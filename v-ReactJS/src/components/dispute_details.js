import React,{ Component} from 'react';
import axios from 'axios';
import AcceptClaim from './accept_claim';
import Message from './message';
import AckReturn from './ack_return_item';
import Escalate from './escalate';
import MakeOffer from './make_offer';
import ProvideEvidence from './provide_evidence';
import UpdateStatus from './update_status';
import AppealDispute from './appeal_dispute';


class Dispute_Detail extends Component{
    state={
        details:[],
        dispute_amount:'',
        disputed_transactions:'',
        buyer:'',
        seller:'',
        gross_amount:'',
        merchandize_dispute_properties:'',
        dispute_id1:this.props.dispute_id,
        dispute_outcome:'',
        extensions:'',
        divFlag:'',
        isLoading:1,
    }
    handleClickDiv=(e)=>{
        console.log(e.target.value);
        this.setState({divFlag:e.target.value});
    }
    componentDidMount(){
        var id = this.state.dispute_id1;
        axios({
            method:'get',
            headers: {
              "content-type" : "application/json",
              "Authorization": "Bearer "+sessionStorage.getItem('access_token')
              },
            url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+id,
          })
            .then(res =>{
              console.log(res);
              this.setState({
                details:res.data,
                dispute_amount:res.data.dispute_amount,
                disputed_transactions:res.data.disputed_transactions[0],
                buyer:res.data.disputed_transactions[0].buyer,
                seller: res.data.disputed_transactions[0].seller,
                extensions:res.data.extensions,
                dispute_outcome:res.data.dispute_outcome,
                isLoading:0,
              })
            })
            .then(()=>{
                console.log(this.state.details);
            })
          }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id1!==nextProps.dispute_id){
            // console.log('I am changed');
            this.setState({
                dispute_id1:nextProps.dispute_id,
                isLoading:1,
                divFlag:''
            });

            console.log(this.state.dispute_id1);
            var id = nextProps.dispute_id;
            axios({
                method:'get',
                headers: {
                  "content-type" : "application/json",
                  "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                  },
                url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+id,
              })
                .then(res =>{
                  console.log(res);
                  this.setState({
                    details:res.data,
                    dispute_amount:res.data.dispute_amount,
                    disputed_transactions:res.data.disputed_transactions[0],
                    buyer:res.data.disputed_transactions[0].buyer,
                    seller: res.data.disputed_transactions[0].seller,
                    extensions:res.data.extensions,
                    dispute_outcome:res.data.dispute_outcome,
                    isLoading:0,
                  })
                })
                
        }
        
    }
    // componentDidUpdate(){
    // var id = this.props.dispute_id;
    // console.log(id);
    // axios.get('http://localhost:4000/get_dispute_detail?dispute_id='+id)
    //     .then(res =>{
    //       console.log(res);
    //       this.setState({
    //         details:res.data
    //       })
    //     })
    //     .then(()=>{
    //         console.log(this.state.details);
    //     })
    //   }
    
    // displayDisputeDetail=()=>{
    //     var id = this.props.dispute_id;
    //     axios.get('http://localhost:4000/get_dispute_detail?dispute_id='+id)
    //         .then(res =>{
    //           console.log(res);
    //           this.setState({
    //             details:res.data,
    //             dispute_amount:res.data.dispute_amount,
    //             disputed_transactions:res.data.disputed_transactions[0],
    //             buyer:res.data.disputed_transactions[0].buyer,
    //             seller: res.data.disputed_transactions[0].seller,
    //             merchandize_dispute_properties:res.data.extensions.merchandize_dispute_properties
    //           })
    //         })
    // }

  render(){
    
    const {details} = this.state;
    console.log(details);
    // console.log(this.state.dispute_outcome.outcome_code)//==="RESOLVED_BUYER_FAVOUR"
    
    return(
        
        <div className={"card dispute_detail z-depth-2 "+ details.status}>
        {
            (details.dispute_id && !this.state.isLoading)?(
                <div className = "card-content">
                <h4> More Details </h4>
                <span className="card-title">{details.dispute_id}</span>
                <ul>
                    <li><b>Create Time: </b>{details.create_time}</li>
                    <li><b>Update Time: </b>{details.update_time}</li>
                    <li><b>Status:</b> {details.status}</li>
                    <li><b>Dispute lifecycle: </b>{details.dispute_life_cycle_stage}</li>
                    <li><b>Reason: </b>{details.reason}</li>
                    <li><b>Dispute amount:</b> {this.state.dispute_amount.value}{this.state.dispute_amount.currency_code}</li>
                    <li><b>Buyer:</b> {this.state.buyer.name}</li>
                    <li> <b>Seller Email:</b> {this.state.seller.email}</li>
                    <li> <b>Merchant Id:</b> {this.state.seller.merchant_id}</li>
                    <li> <b>Store :</b> {this.state.seller.name}</li>
                    <li><b>Transcation status:</b> {this.state.disputed_transactions.transaction_status}</li>
                    {
                        (details.reason==="MERCHANDISE_OR_SERVICE_NOT_RECEIVED"||details.reason==="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED" )?(
                            <li> <b>Issue type :</b> {this.state.extensions.merchandize_dispute_properties.issue_type}</li>):
                            (null)

                    }
                    {
                        (details.status==="RESOLVED")?(
                            <li> <b>Dispute Outcome :</b> 
                            {this.state.dispute_outcome.outcome_code}
                            </li>
                        ):(null)
                    }
                </ul>
                
                {
                    (details.status!=="RESOLVED")?(
                        <div>
                            
                            {
                                (details.reason==="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED"
                                &&this.state.extensions.merchandize_dispute_properties.issue_type==="PRODUCT")?(
                                <button className="btn divBtn waves-effect waves-light" name="action" id="ack_return" value="ack_return" onClick={this.handleClickDiv}>ack_return</button>
                                ):(null)
                            }
                            {
                                
                                (details.dispute_life_cycle_stage==="INQUIRY")?(
                                    <div>
                                    <button className="btn divBtn waves-effect waves-light " name="action" id="message" value="message" onClick={this.handleClickDiv}>Message</button>
                                    {
                                        (details.reason!=="MERCHANDISE_OR_SERVICE_NOT_RECEIVED")?(
                                        <button className="btn divBtn waves-effect waves-light" name="action" id="make_offer" value="make_offer" onClick={this.handleClickDiv}>Make Offer</button>
                                        ):(null)
                                    }
                                    {/* <button className="btn divBtn waves-effect waves-light" name="action" id="make_offer" value="make_offer" onClick={this.handleClickDiv}>Make Offer</button> */}
                                        
                                    <button className="btn divBtn waves-effect waves-light" name="action" id="accept_claim" value="accept_claim" onClick={this.handleClickDiv}>Accept Claim</button>
                                    <button className="btn divBtn waves-effect waves-light" name="action" id="escalate" value="escalate" onClick={this.handleClickDiv}>Escalate to PayPal</button>
                                    
                                    </div>
                                ):(null)
                            }

                            {
                                
                                (details.status==="UNDER_REVIEW")?(
                                    <div>
                                        <button className="btn divBtn waves-effect waves-light" name="action" id="update_status" value="update_status" onClick={this.handleClickDiv}>Update Status</button>
                                    </div>
                                ):(null)
                            }

                            {
                                
                                (details.status==="WAITING_FOR_SELLER_RESPONSE" ||details.status==="WAITING_FOR_BUYER_RESPONSE")?(
                                    <div>
                                        <button className="btn divBtn waves-effect waves-light" name="action" id="provide_evidence" value="provide_evidence" onClick={this.handleClickDiv}>Provide Evidence</button>
                                    </div>
                                ):(null)
                            }

                            {
                                
                                (details.status==="RESOLVED" && this.state.dispute_outcome.outcome_code==="RESOLVED_BUYER_FAVOUR")?(
                                    <div>
                                        <h3>wwww</h3>
                                        <button className="btn divBtn waves-effect waves-light" name="action" id="appeal_dispute" value="appeal_dispute" onClick={this.handleClickDiv}>Appeal Dispute</button>
                                    </div>
                                ):(null)
                            }

                            {
                                (this.state.divFlag==="message")?(
                                    <Message dispute_id={details.dispute_id} messages={details.messages}/>
                                ):(null)
                            }
                            
                            {
                                (this.state.divFlag==="escalate")?(
                                    <Escalate dispute_id={details.dispute_id} />):(null)   
                            }

                            {
                                (this.state.divFlag==="ack_return")?(
                                <AckReturn dispute_id={details.dispute_id}/>):(null)
                                
                            }
                            
                            {
                                (this.state.divFlag==="accept_claim")?(
                                    <AcceptClaim dispute_id={details.dispute_id} reason={details.reason} dispute_amount={this.state.dispute_amount} />):(null)   
                            }
                        
                            {/* {
                                (details.reason!=="MERCHANDISE_OR_SERVICE_NOT_RECEIVED" && this.state.divFlag==="make_offer")?(
                                    <MakeOffer dispute_id={details.dispute_id} reason={details.reason} dispute_amount={this.state.dispute_amount} />):(null)   
                            } */}

                            {
                                ( this.state.divFlag==="make_offer")?(
                                    <MakeOffer dispute_id={details.dispute_id} reason={details.reason} dispute_amount={this.state.dispute_amount} />):(null)   
                            }

                           

                            {
                                (this.state.divFlag==="update_status")?(
                                    <UpdateStatus dispute_id={details.dispute_id} status= {details.status}/>
                                ):(null)
                            }

                            {
                                (this.state.divFlag==="provide_evidence")?(
                                <ProvideEvidence dispute_id={details.dispute_id} reason={details.reason} />
                                ):(null)   
                            }
                            
                        </div>
                    ):(null)

                }
                {/* For appeal dispute */}
                {
                    
                    (details.status==="RESOLVED" && this.state.dispute_outcome.outcome_code==="RESOLVED_BUYER_FAVOUR")?(
                        <div>
                            <button className="btn divBtn waves-effect waves-light" name="action" id="appeal_dispute" value="appeal_dispute" onClick={this.handleClickDiv}>Appeal Dispute</button>
                        </div>
                    ):(null)
                }
                {
                    (this.state.divFlag==="appeal_dispute")?(
                    <AppealDispute dispute_id={details.dispute_id} reason={details.reason} />
                    ):(null)   
                }

                
                
                </div>
            ):(
                <div>
                    <h4> Loading.... </h4>
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div>
                </div>
            )
        }
        
        </div>
        
    )

  }
}
export default Dispute_Detail;






