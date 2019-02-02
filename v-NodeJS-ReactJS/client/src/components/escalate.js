import React,{ Component} from 'react';
import axios from 'axios';
class Escalate extends Component{
    state={
        escalate_note:'',
        dispute_id:this.props.dispute_id
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        console.log(this.state.escalate_note);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            // console.log('I am changed');
            this.setState({
                dispute_id:nextProps.dispute_id
            })
        }
    }
    handleSubmit=(e)=>{
        console.log(this.state.note);
        if(this.state.escalate_note){
            axios.post('http://localhost:4000/escalate',{
            dispute_id:this.state.dispute_id,
            escalate_note:this.state.escalate_note
            })
            .then((res)=>{
            console.log(res);
           
            if(res.data.status===200){
                alert('Successfully, Escalated to PayPal..');
                // this.forceUpdate();
                window.location.reload();
            }
            else{
                alert(res.data.message);
                // alert('Something Went Wrong...');
            }
            })
            .catch((err)=>{
            console.log(err)
            })
        }
        
    }

  render(){
    return(
   
            
            <div className=" card row action_div z-depth-2">
                <span className="card-title">Want to Escalate to PayPal</span>
                <div className="input-field col s9">
                    <textarea id="escalate_note" className="materialize-textarea autocomplete" onChange={this.handleChange}></textarea>
                    <label htmlFor="escalate_note">Notes about the escalation of the dispute to a claim</label>
                </div>
                <div className="col s3 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Escalate</button>
                </div>
               
            
         
            </div>
        

    );
    }
}
export default Escalate;
