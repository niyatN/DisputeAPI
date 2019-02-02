import React,{ Component} from 'react';
import axios from 'axios';
class Message extends Component{
    state={
        message:'',
        dispute_id:this.props.dispute_id
    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            // console.log('I am changed');
            this.setState({
                dispute_id:nextProps.dispute_id
            })
        }
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        // console.log(this.state.message);
    }
    handleSubmit=(e)=>{
        console.log(this.state.message);
        if(this.state.message){
            axios({
                url:'http://localhost:4000/send_message',
                method:'post',
                data:{
            dispute_id:this.state.dispute_id,
            message:this.state.message
            }
        })
            .then((res)=>{
            console.log(res);
            if(res.data.status===200){
                // document.getElementById('message').value='';
                // 'message'.target.value='';
                alert('Message is sent...');
            }
            else{
                alert('Something Went Wrong...');
            }
            
            })
            .catch((err)=>{
            console.log(err)
            })
        }
        
    }

  render(){
    return(
            <div>
           
            <div className=" action_div card row z-depth-3">
                <span className="card-title">Send message to customer</span>
                <div className="input-field col s10">
                    <textarea id="message" className="materialize-textarea autocomplete" onChange={this.handleChange}></textarea>
                    <label htmlFor="message">Message</label>
                </div>
                <div className="col s2 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
               
            </div>
            
        
            </div>
       
        

    );
    }
}
export default Message;
