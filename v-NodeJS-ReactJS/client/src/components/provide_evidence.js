import React,{ Component} from 'react';
import axios from 'axios';
class ProvideEvidence extends Component{
    state={
        note:'',
        evidence_type:'',
        carrier_name :'',
        tracking_number :'',
        refund_ids:'',
        documents:[],
        evidence_notes:'', 
        dispute_id:this.props.dispute_id,

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
    handleFileChange=(e)=>{
        // this.setState({
        //     selectedFile: event.target.files[0],
        //     loaded: 0,
        //   })

        console.log(e.target.files);
    }
    handleSubmit=(e)=>{
        console.log(this.state);
        e.preventDefault();
        let formData = new FormData();

        formData.append("evidence_type",this.state.evidence_type);
        formData.append("note", this.state.note);
        let tracking_info = {};
        tracking_info.carrier_name = this.state.carrier_name;
        tracking_info.tracking_number = this.state.tracking_number;
        formData.append("tracking_info",[tracking_info]);

        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]); 
        }

        if(this.state.note){
            axios({
                url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/provide-evidence",
                method:'post',
                headers: {
                    "content-type" : "multipart/related",
                    "Authorization": "Bearer "+"A21AAEBIAeltg_FD3AxcTQjLJB16hWsdrM1XmWeqxzoMRuodIuTDkRcUd_RXXUFUOxk54aajhD8F08kGJyVtTn7o6IpS_4ELA"
                },
                data:formData,
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
          
           
            <div className=" action_div card row z-depth-3">
                <span className="card-title">Send message to customer</span>
                <form action="#">
                <div className="row col s12">
                <div className="file-field input-field">
                        <div className="btn">
                            <span>File</span>
                            <input type="file" multiple onChange={this.handleFileChange}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload one or more files" onSelect={this.handleFileChange}/>
                        </div>
                    </div>
                    <div className="input-field col s12">
                        <textarea id="note" className="materialize-textarea autocomplete" onChange={this.handleChange}></textarea>
                        <label htmlFor="note">Note</label>
                    </div>

                    <div className="input-field col s6">
                        <input id="evidence_type" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="evidence_type">Evidence type</label>
                    </div>

                    <div className="input-field col s6">
                        <input id="carrier_name" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="carrier_name">Carrier name</label>
                    </div>

                    <div className="input-field col s6">
                        <input id="tracking_number" type="number" className="validate" onChange={this.handleChange} />
                        <label htmlFor="tracking_number">Tracking number</label>
                    </div>

                    
                
                
                    <div className="col s2 send_icon">
                        <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                    </div>
                    
                </div>
                </form>
            </div>
            
        
           
       
        

    );
    }
}
export default ProvideEvidence;
