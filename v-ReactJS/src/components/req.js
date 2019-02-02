axios({
    method:'post',
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+sessionStorage.getItem('access_token')
      },
    url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics',
    data:{
      dimension: 'STATUS',
      measure: 'COUNT'
    }
  })
  .then((res)=>{
    console.log(res.data);
    let status_data = [['Status', 'Count']]
    res.data.metrics.map((i)=>{
        status_data.push([i.key, i.count])
      });
    this.setState({status_data:status_data});
  })
  .catch((err)=>{
    // console.log(sessionStorage.getItem('access_token'));
    console.log(err.response)
  })

  axios({
    method:'post',
    headers: {
      "content-type" : "application/json",
      "Authorization": "Bearer "+sessionStorage.getItem('access_token')
      },
    url:'https://api.sandbox.paypal.com/v1/customer/disputes/compute-metrics',
    data:{
      dimension: 'RESON',
      measure: 'COUNT'
    }
  })
  .then((res)=>{
    console.log(res.data);
    let status_data = [['Status', 'Count']]
    res.data.metrics.map((i)=>{
        status_data.push([i.key, i.count])
      });
    this.setState({status_data:status_data});
  })
  .catch((err)=>{
    // console.log(sessionStorage.getItem('access_token'));
    console.log(err.response)
  })

  










======================


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
        selectedFile:''

    }
    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            console.log('I am changed');
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
        this.setState({
            selectedFile: e.target.files[0],
            loaded: 0,
          })

        console.log(e.target.files);
    }
    handleSubmit=(e)=>{
        console.log(this.state);
        e.preventDefault();
        let formData = new FormData();


        let input = {}
        input.evidence_type = this.state.evidence_type;
        
        let tracking_info = []
        tracking_info.push({
            "carrier_name":this.state.carrier_name,
            "tracking_number":this.state.tracking_number
        });
        input.evidence_info={}
        input.evidence_info.tracking_info = tracking_info;
        input.note = this.state.note;
        let file =this.state.selectedFile;

        formData.append("input", input);
        formData.append("file1", file);

        for(var pair of formData.entries()) {
            console.log(pair[0]+ ', '+ pair[1]); 
        }
        
        if(this.state.note){
            console.log("https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/provide-evidence");
            axios({
                url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/provide-evidence",
                method:'post',
                headers: {
                    "content-type" : "multipart/form-data",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                },
                data:formData,
            })
            .then((res)=>{
                console.log(res);
                console.log('datatatattatatattaTTA......')            
            })
            .catch((err)=>{
            // console.log(err.respose.data)
            // console.log(err)
            console.log(this.state.note)
            })
        }
        console.log('aa')
        
    }

  render(){
      
    return(
          
           
            <div className=" action_div card row z-depth-3">
                <span className="card-title">Provide Evidence</span>
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
