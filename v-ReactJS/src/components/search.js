import React,{ Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
 
class Search extends Component{
    state ={
        start_date:'',
        dispute_id:''
    }

    handleSubmit_ByDate=(e)=>{
        console.log(this.state.start_date);
        // e.preventDefault();
        var url = "/dispute_by_start_time/"+ this.state.start_date;
        this.props.history.push(url);
    }
    handleChange_ByDate = (e)=>{
        this.setState({start_date: e.target.value});
        console.log(this.state);
    }

    handleSubmit_ById = (e)=>{
        var url = "/dispute_id/"+ this.state.dispute_id;
        this.props.history.push(url);
    }
    handleChange_ById = (e)=>{
        this.setState({dispute_id: e.target.value});
        console.log(this.state);
    }


  render(){
    return(
        <div className="container">
            <div className="row">
                <form onSubmit ={this.handleSubmit_ByDate} >
                <div className="form col s12 l4 card blue lighten-3">
                    <span className="card-title">Search by Start time</span>
                    <div className="input-field col s12 l12">
                        <input id="start_date" type="date" className="datepicker" required="required" onChange = {this.handleChange_ByDate} />
                    </div>
                    <div className="input-field col s12">
                        <input className="btn waves-effect waves-light" type="submit"  value="Submit"  />
                    </div>
                </div>
                </form>
                <form onSubmit = {this.handleSubmit_ById} >
                    <div className="form col s12 l4 card blue lighten-4">
                        <span className="card-title">Search by Id</span>
                        <div className="input-field col s12 l12">
                        <input id="dispute_id" type="text" className="validate" required="required" onChange = {this.handleChange_ById} />
                        </div>
                        <div className="input-field col s12">
                        <input className="btn waves-effect waves-light" type="submit" name="action" value="Submit" onSubmit={()=>{}}/>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
    }
}
export default Search;
