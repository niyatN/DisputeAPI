import React,{ Component} from 'react';
import axios from 'axios';

class MakeOffer extends Component{
    state={
        
        dispute_id:this.props.dispute_id,
        reason:this.props.reason,
        mo_note:'',
        mo_address_line_1:'',
        mo_address_line_2:'',
        mo_admin_area_1:'',
        mo_admin_area_2:'',
        mo_country_code:'',
        mo_postal_code:'',
        mo_offer_amount_currency_code:'',
        mo_offer_amount_value:'',
        mo_invoice_id:'',
        mo_offer_type:'REFUND_WITH_REPLACEMENT',
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
        this.setState({[e.target.id]:e.target.value})
    }
    handleSubmit=(e)=>{
        
        let data = {
            dispute_id:this.state.dispute_id,
            body:{
                note:this.state.mo_note,
                offer_type:this.state.mo_offer_type
            }
        }
        
       
        if(this.state.mo_offer_type==="REFUND_WITH_RETURN"){
            console.log('aa');
            data.body.return_shipping_address={
                address_line_1:this.state.mo_address_line_1,
                address_line_2:this.state.mo_address_line_2,
                admin_area_1:this.state.mo_admin_area_1,
                admin_area_2:this.state.mo_admin_area_2,
                country_code:this.state.mo_country_code,
                postal_code:this.state.mo_postal_code
            }

        }
        console.log(this.state.dispute_amount_value,this.state.mo_offer_amount_currency_code);
        if(this.state.mo_offer_type==="REFUND_WITH_REPLACEMENT"){
            data.body.offer_amount={
                currency_code:this.state.mo_offer_amount_currency_code,
                value:this.state.mo_offer_amount_value
            }
        }
        // data.body.offer_amount={
        //     currency_code:this.state.mo_offer_amount_currency_code,
        //     value:this.state.mo_offer_amount_value
        // }
        if(this.state.mo_invoice_id){
            data.body.invoice_id = this.state.mo_invoice_id
        }
        console.log(data);
        // console.log(this.state);
        
        if(this.state.mo_note &&this.state.mo_offer_type){
            console.log(5);
            axios({
                url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/make-offer",
                method:'post',
                headers: {
                    "content-type" : "application/json",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                },
                data:data.body
            })
            .then((res)=>{
            console.log(res);
            
                alert('Action successful...');
            
            
            })
            .catch((err)=>{
                alert('Something went wrong '+ err.response.data.details[0].issue);
                console.log(err.response);
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
                <span className="card-title">Make Offer</span>
                <div className="col s12">
                    <select value={this.state.offer_type} id="mo_offer_type"className="browser-default" onChange={this.handleChange}>
                        <option value="REFUND_WITH_REPLACEMENT">Refund with replacement</option>
                        <option value="REPLACEMENT_WITHOUT_REFUND">Replacement without refund</option>
                        <option value="REFUND">Refund </option>
                        <option value="REFUND_WITH_RETURN">Refund with return</option>
                        
                    </select>
                </div>
                
                <div className="input-field col s12">
                    <textarea id="mo_note" className="materialize-textarea validate" onChange={this.handleChange} ></textarea>
                    <label htmlFor="mo_note">Note</label>
                </div>
                <div className="row col s12">
                    <div className="input-field col s6">
                        <input id="mo_invoice_id" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="mo_invoice_id">Invoice Id</label>
                    </div>

                    <div className="input-field col s3">
                        <input id="mo_offer_amount_value" type="number" className="validate" onChange={this.handleChange} min="0" max={this.state.dispute_amount_value} />
                        <label htmlFor="mo_offer_amount_value">Offer amount</label>
                    </div>

                    <div className="input-field col s3">
                        <input id="mo_offer_amount_currency_code"  type="text" className="validate"  maxLength="3" minLength="3" onChange={this.handleChange}  />
                        <label htmlFor="mo_offer_amount_currency_code">Currency code</label>
                    </div>
                </div>
                {
                    (this.state.mo_offer_type=== "REFUND_WITH_RETURN")?(
                        <div className="col 12">
                        <h6> Return shipping address</h6>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="mo_address_line_1" type="text" className="validate" required="required" onChange={this.handleChange} />
                                <label htmlFor="mo_address_line_1">Address line 1</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="mo_address_line_2" type="text" className="validate" onChange={this.handleChange}  />
                                <label htmlFor="mo_address_line_2">Address line 2</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="mo_admin_area_1" type="text" className="validate" required="required" onChange={this.handleChange} />
                                <label htmlFor="mo_admin_area_1">Admin area 1</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="mo_admin_area_2" type="text" className="validate" onChange={this.handleChange}  />
                                <label htmlFor="mo_admin_area_2">Admin area 2</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="mo_country_code" type="text" className="validate" required="required" onChange={this.handleChange}  />
                                <label htmlFor="mo_country_code">Country code</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="mo_postal_code" type="number" className="validate" onChange={this.handleChange} />
                                <label htmlFor="mo_postal_code">Postal code</label>
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
export default MakeOffer;
// && this.state.mo_offer_amount_value<=this.state.dispute_amount_value