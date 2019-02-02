import React,{ Component} from 'react';
import axios from 'axios';
class Message extends Component{
    state={
        message:'',                         // TO SEND
        dispute_id:this.props.dispute_id,
        messages:this.props.messages                     // Chat
    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            // console.log('I am changed');
            this.setState({
                dispute_id:nextProps.dispute_id,
                messages:nextProps.messages
            })
        }
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        console.log(this.state.message);
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        if(this.state.message){
            axios({
                headers: {
                    "content-type" : "application/json",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                    },
                url: "https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/send-message",
                method:'post',
                data:{
                    message:this.state.message
                }
            })
            .then((res)=>{
                console.log(res);
                this.setState({message:''});
                console.log(this.state);
                axios({
                    method:'get',
                    headers: {
                      "content-type" : "application/json",
                      "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                      },
                    url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id,
                  })
                    .then(res =>{
                    //   console.log(res);
                    alert('Message is sent...');
                      this.setState({
                        messages:res.data.messages
                      })
                    })
                    .then(()=>{
                        console.log(this.state.details);
                    })
                
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    }

  render(){

    const chat = 
        (this.state.messages)?(
                this.state.messages.map((msg)=>{
                    return(
                        // <div key={msg.time_posted}>
                        //     {
                        //         (msg.posted_by ==="SELLER")?(
                      
                        //             <p>{msg.content}</p>
                        //         ):(
                        //             (msg.posted_by==="BUYER")?(
                                        
                        //                 <p>{msg.content}</p>
                        //             ):(
                        //                 <p>{msg.content}</p>
                        //             )
                        //         )   
                        //     }
                        // </div>
                        <div className="row z-depth-6" key={msg.time_posted}>
                            <div  className={"col s12 message_by_"+msg.posted_by }>
                         
                                <span>
                                    {msg.content}   
                                </span>
                                <p className="message_time_posted">{msg.time_posted.slice(0,10)+" "}{msg.time_posted.slice(11,16)}</p>
                            </div>
                        </div>
                    )
                   
                })

            )
            :(
            <p><b>...No conversation yet...</b></p>
        )
    
    
    return(
          
           
            <div className=" action_div card row z-depth-3">
                <span className="card-title">Send message to customer</span>
                    
                    {
                        chat
                    }

                <form>
                   
                    <div className="input-field col s10">
                        <textarea id="message" className="materialize-textarea autocomplete" onChange={this.handleChange}></textarea>
                        <label htmlFor="message">Message</label>
                    </div>
                    <div className="col s2 send_icon">
                        <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                    </div>
                </form>
            </div>
            
        
         
       
        

    );
    }
}
export default Message;
