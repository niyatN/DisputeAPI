import React,{ Component} from 'react';
import axios from 'axios';
class ValidateEliibility extends Component{
    state={
        encrypted_transaction_id:'',
        dispute_id:'',
        loaded:1,
        eligible_dispute_reasons:[],
        ineligible_dispute_reasons:[]
    }
    
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        console.log(this.state);
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        let data = {}
        if(this.state.encrypted_transaction_id){
            data.encrypted_transaction_id = this.state.encrypted_transaction_id
        }
        else{
            data.dispute_id = this.state.dispute_id
        }
        console.log(data);
        if(data){
            this.setState({loaded:0});
            axios({
                headers: {
                    "content-type" : "application/json",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                    },
                url: "https://api.sandbox.paypal.com/v1/customer/disputes/validate-eligibility",
                method:'post',
                data:data
            })
            .then((res)=>{
                console.log(res);
                
                this.setState({
                    loaded:2,
                    eligible_dispute_reasons:res.data.eligible_dispute_reasons,
                    ineligible_dispute_reasons:res.data.ineligible_dispute_reasons||[]
                });
            })
            .catch((err)=>{
                this.setState({loaded:0});
                console.log(err.response);
                alert(err.response.data.details[0].issue);
            })
        }
        
    }

  render(){   
    console.log(this.state);
    const eligible_dispute_reasons =  
        this.state.eligible_dispute_reasons.map((i)=>{
            return(
            <tr key={i.dispute_reason}>
                <td>{i.dispute_reason}</td>

                <td>{i.allowable_life_cycle_stage||<p>Yes</p>}</td>
            </tr>
            )
        })
    
    const ineligible_dispute_reasons =    
    
        this.state.ineligible_dispute_reasons.map((i)=>{
            return(
            <tr key={i.dispute_reason} >
                <td className="col s7">{i.dispute_reason}</td>
                <td className="col s5">{i.ineligibility_reason}</td>
            </tr>
            )
        })
    console.log(ineligible_dispute_reasons);
    return(
          
           
            <div className=" action_div card row z-depth-3 col s12 l12 m12">
                <span className="card-title">Validate Eligibility</span>
                   
                <form>
                   
                    <div className="input-field col s6">
                        <input id="encrypted_transaction_id" type="text" className="validate" onChange={this.handleChange}/>
                        <label htmlFor="encrypted_transaction_id">Encrypted transaction id</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="dispute_id" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="dispute_id">Dispute Id</label>
                    </div>
                    {
                    (this.state.loaded===0)?(
                    <div className="row">
                        <div className="progress">
                            <div className="indeterminate"></div>
                    </div>
                    </div>
                    ):(
                        null
                    )                   
                    }
                    {
                        (this.state.loaded===2)?(
                        <div className="eligibility-table">
                        <table>
                            <thead>
                            <tr>
                                <th>Dispute reason</th>
                                <th>Allowable life cycle stage/ Allow to update a dispute reason?</th>
                            </tr>
                            </thead>

                            <tbody>
                               {
                                   eligible_dispute_reasons
                               }
                            </tbody>
                        </table>

                        <br/><hr/><br/>

                        <table>
                            <thead>
                            <tr>
                                <th className="col s7">Dispute reason</th>
                                <th className="col s5">ineligibility_reason</th>
                            </tr>
                            </thead>

                            <tbody>
                                {
                                    ineligible_dispute_reasons
                                }
                            </tbody>
                        </table>
                        </div>
                        ):(null)
                    }   
                    <div className="col s2 send_icon">
                        <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                    </div>
                </form>



                
            </div>
            
        
         
       
        

    );
    }
}
export default ValidateEliibility;
