import React,{ Component} from 'react';
import axios from 'axios';

class AcceptClaim extends Component{
    state={
        accept_claim_note:'',
        dispute_id:this.props.dispute_id,
        reason:this.props.reason,
        accept_claim_reason :'REASON_NOT_SET',
        address_line_1:'',
        address_line_2:'',
        admin_area_1:'',
        admin_area_2:'',
        country_code:'',
        postal_code:'',
        refund_amount_currency_code:'',
        refund_amount_value:'',
        invoice_id:'',
        dispute_amount_value:this.props.dispute_amount.value,


    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            // console.log('I am changed');
            this.setState({
                dispute_id:nextProps.dispute_id,
                reason:nextProps.reason,
                dispute_amount_value:nextProps.dispute_amount_value
            })
        }
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value},
        ()=>console.log(this.state)
    );
        
    }
    handleSubmit=(e)=>{
        console.log(this.state.accept_claim_note);
        var data = {
            dispute_id:this.state.dispute_id,
            body:{
                note:this.state.accept_claim_note,
                // accept_claim_reason:this.state.accept_claim_reason
            }
        }
        
        console.log(this.state.refund_amount_value ,this.state.dispute_amount_value);
        if(parseFloat(this.state.refund_amount_value)<parseFloat(this.state.dispute_amount_value)&&(this.state.reason==="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED" )){
            console.log('aa');
            data.body.return_shipping_address={
                address_line_1:this.state.address_line_1,
                address_line_2:this.state.address_line_2,
                admin_area_1:this.state.admin_area_1,
                admin_area_2:this.state.admin_area_2,
                country_code:this.state.country_code,
                postal_code:this.state.postal_code
            }

        }
        
        if((this.state.refund_amount_currency_code)&&(this.state.refund_amount_value)){
            data.body.refund_amount={
                currency_code:this.state.refund_amount_currency_code,
                value:this.state.refund_amount_value
            }
        }
        if(this.state.invoice_id){
            data.body.invoice_id = this.state.invoice_id
        }
        console.log(data);
        if(this.state.accept_claim_note &&  this.state.refund_amount_value>=0){
            axios({
                url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/accept-claim",
                method:'post',
                
                headers: {
                    "content-type" : "application/json",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                    },
                data:data.body,
            })
            .then((res)=>{
            console.log(res);
            alert('Successfully, Accepted the claim..');
            
            })
            .catch((err)=>{
                console.log(err.response);
                alert('Something went wrong '+ err.response.data.details[0].issue);
                throw err;
            })
        }
    }

  render(){
    //   console.log(this.state.dispute_amount);
      console.log(this.state.refund_amount_value);
    return(
            <div>
            <div className=" action_div card row">
                <span className="card-title">Accept Claim</span>
                <div className="col s12">
                    <select value={this.state.accept_claim_reason} id="accept_claim_reason"className="browser-default" onChange={this.handleChange}>
                        <option value="DID_NOT_SHIP_ITEM">Could not ship the item</option>
                        <option value="TOO_TIME_CONSUMING">Taking too long for merchant to fulfil the order</option>
                        <option value="LOST_IN_MAIL">The item is lost in mail or transit</option>
                        <option value="NOT_ABLE_TO_WIN">Not able to find sufficient evidence to win this dispute</option>
                        <option value="COMPANY_POLICY">Internal company policy</option>
                        <option value="REASON_NOT_SET">None of the above reasons apply</option>
                    </select>
                </div>
                
                <div className="input-field col s12">
                    <textarea id="accept_claim_note" className="materialize-textarea validate" onChange={this.handleChange} ></textarea>
                    <label htmlFor="accept_claim_note">Note</label>
                </div>
                <div className="row col s12">
                    <div className="input-field col s6">
                        <input id="invoice_id" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="invoice_id">Invoice Id</label>
                    </div>

                    <div className="input-field col s3">
                        <input id="refund_amount_value" type="number" className="validate" onChange={this.handleChange} min="0" max={this.state.dispute_amount_value} />
                        <label htmlFor="refund_amount_value">Refund amount</label>
                    </div>

                    <div className="input-field col s3">
                        <input id="refund_amount_currency_code"  type="text" className="validate"  maxLength="3" minLength="3" onChange={this.handleChange}  />
                        <label htmlFor="refund_amount_currency_code">Currency code</label>
                    </div>
                </div>
                {
                    (this.state.reason==="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED" ||parseFloat(this.state.refund_amount_value)<parseFloat(this.state.dispute_amount_value))?(
                        <div className="col 12">
                        <h6> Return shipping address</h6>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="address_line_1" type="text" className="validate" required="required" onChange={this.handleChange} />
                                <label htmlFor="address_line_1">Address line 1</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="address_line_2" type="text" className="validate" onChange={this.handleChange}  />
                                <label htmlFor="address_line_2">Address line 2</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="admin_area_1" type="text" className="validate" required="required" onChange={this.handleChange} />
                                <label htmlFor="admin_area_1">Admin area 1</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="admin_area_2" type="text" className="validate" onChange={this.handleChange}  />
                                <label htmlFor="admin_area_2">Admin area 2</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="country_code" type="text" className="validate" required="required" onChange={this.handleChange}  />
                                <label htmlFor="country_code">Country code</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="postal_code" type="number" className="validate" onChange={this.handleChange} />
                                <label htmlFor="postal_code">Postal code</label>
                            </div>

                        </div>
                        </div>
                    ):(null)
                }
                
                <div className="col s2 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
               
            </div>
            
        
            </div>
       
        

    );
    }
}
export default AcceptClaim;


// this.state.accept_claim_note && && this.state.refund_amount_value<=this.state.dispute_amount_value