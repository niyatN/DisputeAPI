import React,{ Component} from 'react';
import axios from 'axios';

class CreateDispute extends Component{
    state={
        buyer_transaction_id :"",
        seller_transaction_id :'',
        reason:'MERCHANDISE_OR_SERVICE_NOT_RECEIVED',
        currency_code :'USD',
        value :'',
        posted_by:'',
        content:'',
        issue_type:'PRODUCT',

        // For File uploading...
        loaded:1,  // 0: File is still uploading
        selectedFile:'',
        selectedFileContent:'',
        selectedFileType:'',
        selectedFileName:''

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
    
    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value},
        ()=>console.log(this.state)
    );
        
    }
    handleSubmit=(e)=>{
        console.log(this.state.accept_claim_note);
        var data = {
            body:{
                reason:this.state.reason
            }
        }

        if(this.state.buyer_transaction_id){
            let disputed_transactions=[];
            disputed_transactions.push({"buyer_transaction_id":this.state.buyer_transaction_id});
            data.body.disputed_transactions=disputed_transactions;
        }
        // else{
        //     let disputed_transactions=[];
        //     disputed_transactions.push({"seller_transaction_id":this.state.seller_transaction_id});
        //     data.body.disputed_transactions=disputed_transactions;
        // }

        if(this.state.value){
            data.body.dispute_amount={};
            data.body.dispute_amount.currency_code=this.state.currency_code;
            data.body.dispute_amount.value = this.state.value;
        }

        if(this.state.content){
            let messages = [];
            let posted_by = (this.state.buyer_transaction_id)?("BUYER"):("SELLER");
            messages.push({
                "posted_by":posted_by,
                content:this.state.content,
                time_posted: new Date()
            });
            data.body.messages=messages;
        }
        data.body.extensions={};
        data.body.extensions.merchandize_dispute_properties={};
        // data.body.extensions.merchant_contacted_outcome="NO_RESPONSE";
        data.body.extensions.merchant_contacted = true;
        data.body.extensions.merchandize_dispute_properties.issue_type = this.state.issue_type;

        
        console.log(data);

        let bodyData = '--myboundary\nContent-Disposition: form-data; name="myContent";\nContent-Type: application/json\n\n'+JSON.stringify(data.body)+'\n';
        if(this.state.selectedFile){
            bodyData +='--myboundary\nContent-Disposition: form-data; name="file12"; filename=\"'+this.state.selectedFileName+'\"\nContent-Type:'+this.state.selectedFileType+' \n\n'+this.state.selectedFileContent+'\n'
        }
        bodyData +='--myboundary--\n';
        console.log(bodyData)
        if(data.body.disputed_transactions && this.state.loaded===1){
            axios({
                url:"https://api.sandbox.paypal.com/v1/customer/disputes/",
                method:'post',
                headers: {
                    "content-type" : "multipart/related;boundary=myboundary",
                    "Authorization": "Bearer "+sessionStorage.getItem('access_token')
                    },
                data:bodyData,
            })
            .then((res)=>{
            console.log(res);
            alert('Dispute created...');
            
            })
            .catch((err)=>{
                console.log(err.response);
                alert('Something went wrong '+ err.response.data.details[0].issue);
                throw err;
            })
        }
        
    }

  render(){
    
    return(
            <div>
           
            <div className="action_div card row">
                <span className="card-title">Create Dispute</span>
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" multiple onChange={this.handleFileChange}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Allowed File Extention: JPG, PNG, PDF or GIF" onSelect={this.handleFileChange}/>
                    </div>
                </div>
                <div className="col s12">
                    <select value={this.state.reason} id="reason"className="browser-default" onChange={this.handleChange}>
                        <option value="MERCHANDISE_OR_SERVICE_NOT_RECEIVED">Not receive the merchandise or service</option>
                        <option value="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED"> merchandise or service is not as described</option>
                        <option value="UNAUTHORISED">Unauthorize purches</option>
                        <option value="CREDIT_NOT_PROCESSED">Refund or credit was not processed</option>
                        <option value="DUPLICATE_TRANSACTION">transaction was a duplicate</option>
                        <option value="INCORRECT_AMOUNT">charged an incorrect amount</option>
                        <option value="PAYMENT_BY_OTHER_MEANS"> Paid for the transaction through other means</option>
                        <option value="CANCELED_RECURRING_BILLING">Charged for a subscription or a recurring transaction that was canceled</option>
                        <option value="PROBLEM_WITH_REMITTANCE">A problem occurred with the remittance</option>
                        <option value="OTHER">Other</option>
                        
                    </select>
                </div>
                
                <div className="input-field col s12">
                    <textarea id="content" className="materialize-textarea validate" onChange={this.handleChange} ></textarea>
                    <label htmlFor="content">Message</label>
                </div>
                <div className="row col s12">
                    <div className="input-field col s12">
                        <input id="buyer_transaction_id" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="buyer_transaction_id">Buyer transaction Id</label>
                    </div>
                    {/* <div className="input-field col s6">
                        <input id="seller_transaction_id" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="seller_transaction_id">Seller transaction Id</label>
                    </div> */}

                    <div className="col s6">
                        <select value={this.state.issue_type} id="issue_type"className="browser-default" onChange={this.handleChange}>
                            <option value="PRODUCT">Product</option>
                            <option value="SERVICE"> Service</option>                       
                        </select>
                    </div>

                    <div className="input-field col s3">
                        <input id="value" type="number" className="validate" onChange={this.handleChange} min="0" max={this.state.dispute_amount_value} />
                        <label htmlFor="value">Dispute amount</label>
                    </div>

                    <div className="input-field col s3">
                        <input id="refund_amount_currency_code"  type="text" className="validate"  maxLength="3" minLength="3" onChange={this.handleChange}  />
                        <label htmlFor="refund_amount_currency_code">Currency code</label>
                    </div>
                </div>
                <div className="col s2 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" onClick={this.handleSubmit}>Send</button>
                </div>
            </div>
            
        
            </div>
       
        

    );
    }
}
export default CreateDispute;

