import React,{ Component} from 'react';
import axios from 'axios';
class UpdateStatus extends Component{
    state = {
        action:'BUYER_EVIDENCE',
        dispute_id:this.props.dispute_id,
    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            // console.log('I am changed');
            this.setState({
                dispute_id:nextProps.dispute_id,
            })
        }
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        console.log(this.state.message);
        // console.log(window.location)
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        let data = {};
        data.action = this.state.action;

        console.log(this.state.dispute_id);
       
        axios({
            headers: {
                "content-type" : "application/json",
                "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                },
            url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/require-evidence",
            method:'post',
            data:data
        })
        .then((res)=>{
            console.log(res);
            alert('Successfully change the dispute status');
            // window.location.reload();
        })
        .catch((err)=>{
            alert('Something went wrong: '+ err.response.data.details[0].issue)
            console.log(err)
        })
    
        
    }

  render(){

        
    return(
          
           
            <div className=" action_div card row z-depth-3">
               <div className="col s12">
                    <select value={this.state.action} id="action"className="browser-default" onChange={this.handleChange}>
                        <option value="BUYER_EVIDENCE">Update Status to WAITING_FOR_BUYER_RESPONSE</option>
                        <option value="SELLER_EVIDENCE">Update Status to WAITING_FOR_SELLER_RESPONSE</option>
                    </select>
                </div>
                <div className="col s2 send_icon">
                        <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
            </div>
            
        
         
       
        

    );
    }
}
export default UpdateStatus;
