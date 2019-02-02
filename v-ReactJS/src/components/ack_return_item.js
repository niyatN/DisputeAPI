import React,{ Component} from 'react';
import axios from 'axios';
class AckReturn extends Component{
    state={
        note:'',
        dispute_id:this.props.dispute_id
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            this.setState({
                dispute_id:nextProps.dispute_id
            })
        }
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log(this.state.note);
        if(this.state.note){
            axios({
                headers: {
                    "content-type" : "application/json",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                    },
                url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/acknowledge-return-item",
                method:'post',
                data:{
                    note:this.state.note
                }
            })
            .then((res)=>{
                console.log(res);
                alert('Acknowledge sent successfully..');
                // this.forceUpdate();
            })
            .catch((err)=>{
                alert('Something went wrong: '+ err.response.data.details[0].issue) ;
                throw err;
            })
        }
        
    }

  render(){
    return(
   
            
            <div className=" card row action_div z-depth-4">
            <form >
                <span className="card-title">Acknowledge returned item</span>
                <div className="input-field col s10">
                    <textarea id="note" className="materialize-textarea autocomplete" onChange={this.handleChange}></textarea>
                    <label htmlFor="note">Note</label>
                </div>
                <div className="col s2 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
               
            </form>
         
            </div>
        

    );
    }
}
export default AckReturn;
