import React, { Component } from 'react';
import fs from 'fs';


// const Test = ()=>{
//     let fileReader;
//     const handleFileRead = (e)=>{
//         const content = fileReader.result;
//         console.log(content);
//     }
//     const handleFileChosen = (e)=>{
//         fileReader = new FileReader();
//         fileReader.onloadend = handleFileRead;
//         fileReader.readAsText(e.target.files[0]);
//     }

//     return(
//         <div>
//             <input type='file' id ='file' onChange={handleFileChosen} />
//         </div>
//     )

    
// }
    
// export default Test;


class Test extends Component {
    state={
        file:''
    }


    handleFileChosen=(e)=>{
        this.setState({
            file:e.target.files[0]
        });
        console.log(e.target.files[0])
        let fileReader = new FileReader();
        fileReader.onloadend = ()=>{
            console.log(fileReader.result);
            
        }
        fileReader.readAsText(e.target.files[0]);
    }

    // handleFileRead(e){
    //     let content = e.result;
    //     console.log(content);
    //     console.log(e);
    // }

    render(){
        return(
        <div>
            <input type="file" id = 'file' onChange={this.handleFileChosen} />
        </div>
        )
    }
}

export default Test;    