import React,{ Component} from 'react';
import axios from 'axios';
class AckReturn extends Component{
    state={
        note:'',
        dispute_id:this.props.dispute_id
    }
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        console.log(this.state.note);
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
        if(this.state.note){
            axios.post('http://localhost:4000/acknowledge_return_item',{
            dispute_id:this.state.dispute_id,
            note:this.state.note
            })
            .then((res)=>{
            console.log(res);
            // alert('Acknowledge sent successfully..');
            if(res.data.status===200){
                alert('Acknowledge sent successfully..');
                this.forceUpdate();
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
   
            
            <div className=" card row action_div z-depth-4">
                <span className="card-title">Acknowledge returned item</span>
                <div className="input-field col s10">
                    <textarea id="note" className="materialize-textarea autocomplete" onChange={this.handleChange}></textarea>
                    <label htmlFor="note">Note</label>
                </div>
                <div className="col s2 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
               
            
         
            </div>
        

    );
    }
}
export default AckReturn;
