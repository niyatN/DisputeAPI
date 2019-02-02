import React, { Component } from 'react';
import axios from 'axios';
import fs from 'fs';



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
        reason:this.props.reason,
        
        // for return shipping address
        address_line_1:'',
        address_line_2:'',
        admin_area_1:'',
        admin_area_2:'',
        country_code:'',
        postal_code:'',
        
        // for File Uploading
        loaded:1,  // 0: File is still uploading
        selectedFile:'',
        selectedFileContent:'',
        selectedFileType:'',
        selectedFileName:''
    }

    

    componentWillReceiveProps(nextProps){
        if(this.props.dispute_id!==nextProps.dispute_id){
            console.log('I am changed');
            this.setState({
                dispute_id:nextProps.dispute_id,
                reason:nextProps.reason
            })
        }
    }

    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value});
        console.log(this.state);
    }

    handleFileChange=(e)=>{
        let fileReader = new FileReader();
        this.setState({
            selectedFile:e.target.files[0]
        },()=>{
            console.log(this.state.selectedFile);
            console.log(this.state.selectedFile.type);
        });
        fileReader.readAsText(e.target.files[0]);
        fileReader.onloadstart = ()=>{
            console.log('File uploading is started');
            this.setState({
                loaded:0,
            })
        }
        this.setState({
            selectedFileType:e.target.files[0].type,
            selectedFileName:e.target.files[0].name
        })
        fileReader.onloadend = ()=>{
            // console.log(fileReader.result);
            this.setState({
                selectedFileContent :fileReader.result 
            },()=>{
                console.log(this.state.selectedFileContent);
                this.setState({
                    loaded:1
                })
            });
            console.log('File uploading is completed..');
            
        }
        
    }



    handleSubmit=(e)=>{
        console.log(this.state);
        e.preventDefault();

        let tracking_info = []
        tracking_info.push({
            "carrier_name":this.state.carrier_name,
            "tracking_number":this.state.tracking_number
        });
        
        
        let data = {
            evidence_type :this.state.evidence_type,
            evidence_info:{},
            notes:this.state.note
        }
        data.evidence_info.tracking_info = tracking_info;
        let return_shipping_address={
                address_line_1:this.state.address_line_1,
                address_line_2:this.state.address_line_2,
                admin_area_1:this.state.admin_area_1,
                admin_area_2:this.state.admin_area_2,
                country_code:this.state.country_code,
                postal_code:this.state.postal_code
            }
        
        

        let bodyData = '--bbb\nContent-Disposition: form-data;\nname="myContent";\nContent-Type: application/json\n\n'+JSON.stringify(data)+'\n';
        // let bodyData = '--bbb\nContent-Disposition: form-data;\nname="myContent";\nContent-Type: application/json\n\n'+JSON.stringify(data)+'\n--bbb\n"return_shipping_address="'++'bbb--';
        if(this.state.reason==="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED"){
            bodyData +='--bbb\nContent-Disposition: form-data;\nname="return_shipping_address";\nContent-Type: application/json\n\n'+JSON.stringify(return_shipping_address)+'\n';
        }
        if(this.state.selectedFile){
            bodyData +='--bbb\nContent-Disposition: form-data; name="file12"; filename=\"'+this.state.selectedFileName+'\"\nContent-Type:'+this.state.selectedFileType+' \n\n'+this.state.selectedFileContent+'\n'
        }
        bodyData +='--bbb--\n';
        console.log(bodyData)
        if(this.state.loaded===1){
            axios({
            url:"https://api.sandbox.paypal.com/v1/customer/disputes/"+this.state.dispute_id+"/provide-evidence",
            method:'post',
            headers:{
                "content-type" : "multipart/related;boundary=bbb",
                "Authorization": "Bearer "+sessionStorage.getItem('access_token')
            },
            data: bodyData
            })
            .then((res)=>{
                console.log(res);
                alert('successfully completed....');
            })
            .catch((err)=>{
                console.log(err.response.data);
                alert('Something went wrong: '+ err.response.data.details[0].issue);
            })
        }
        
    }

    
    render(){
        return(
            <div className=" action_div card row z-depth-3">
                <span className="card-title">Provide Evidence</span>
                <form  encType="utf-8" onSubmit={this.handleSubmit}>
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
                        {/* <select value={this.state.evidence_type} id="evidence_type"className="browser-default" onChange={this.handleChange}>
                            <option value="DID_NOT_SHIP_ITEM">Could not ship the item</option>
                            <option value="TOO_TIME_CONSUMING">Taking too long for merchant to fulfil the order</option>
                            <option value="LOST_IN_MAIL">The item is lost in mail or transit</option>
                            <option value="NOT_ABLE_TO_WIN">Not able to find sufficient evidence to win this dispute</option>
                            <option value="COMPANY_POLICY">Internal company policy</option>
                            <option value="REASON_NOT_SET">None of the above reasons apply</option>
                        </select> */}
                    </div>

                    <div className="input-field col s6">
                        <input id="carrier_name" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="carrier_name">Carrier name</label>
                    </div>

                    <div className="input-field col s6">
                        <input id="tracking_number" type="number" className="validate" onChange={this.handleChange} />
                        <label htmlFor="tracking_number">Tracking number</label>
                    </div>

                    
                
                
                    {
                    (this.state.reason==="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED")?(
                        <div className="col 12">
                        <h6> Return shipping address</h6>
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="address_line_1" type="text" className="validate" required="required" onChange={this.handleChange} />
                                <label htmlFor="address_line_1">Address line 1</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="address_line_2" type="text" className="validate" onChange={this.handleChange}  />
                                <label htmlFor="address_line_2">Address line 2</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="admin_area_1" type="text" className="validate" required="required" onChange={this.handleChange} />
                                <label htmlFor="admin_area_1">Admin area 1</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="admin_area_2" type="text" className="validate" onChange={this.handleChange}  />
                                <label htmlFor="admin_area_2">Admin area 2</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="country_code" type="text" className="validate" required="required" onChange={this.handleChange}  />
                                <label htmlFor="country_code">Country code</label>
                            </div>

                            <div className="input-field col s6">
                                <input id="postal_code" type="number" className="validate" onChange={this.handleChange} />
                                <label htmlFor="postal_code">Postal code</label>
                            </div>

                        </div>
                        </div>
                    ):(null)
                    }
                    
                    <div className="col s2 send_icon">
                        <button className="btn waves-effect waves-light" type="submit">Send</button>
                    </div>
                </div>
                </form>
            </div>
            
        )
    }
}
export default ProvideEvidence;