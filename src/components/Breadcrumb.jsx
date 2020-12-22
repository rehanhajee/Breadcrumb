import React, { Component } from 'react';

import './Breadcrumb.css';

class Breadcrumb extends Component {
  componentDidMount() {

  }

  constructor(props) {
		super(props);
		
		this.state = {
      filePath: window.location.pathname,
      response: '',
      fileContent: ''
    };

    this.getLocalDir = this.getLocalDir.bind(this);
    this.breadcrumbOutput = this.breadcrumbOutput.bind(this);
    this.outputHandler = this.outputHandler.bind(this);

    this.getLocalDir();
  }

  
  getLocalDir() {
    fetch('http://localhost:3080' + this.state.filePath, {
      method: 'GET',
      headers: {
        'Accept': '*/*'
      },
    }).then(response => {
      response.json().then(data => {
        this.setState({response:data.files});
        this.setState({fileContent:data.fileContent});
      })
    }).catch(error => {
      console.log(error);
    });
  }

  breadcrumbOutput() { 
    let directory = [];
    if (this.state.filePath.slice(-1) === "/") {
      directory = (this.state.filePath.substring(0,this.state.filePath.length - 1)).split("/");
      directory.pop();
    } else {
      directory = (this.state.filePath).split("/");
      directory.shift();
    }
    
    
    let fulldir = "";
    return directory.map((value, index) => {
      fulldir += "/" + value;   
      
      if (index !== directory.length - 1) {
        return <div><a className="breadcrumb-item" href={fulldir} key={index}>{value}</a><span className="breadcrumb-item-seperator">▶</span></div>
      }
      return <a className="breadcrumb-item" href={fulldir} key={index}>{value}</a>
    })
  }


  outputHandler() {
    if (this.state.fileContent.length === 0) {
      let files = (this.state.response).split(";");
      files.pop();

      return files.map((value, index) => {
        if (this.state.filePath.slice(-1) === "/") {
          return <section><a className="files" href={this.state.filePath + value} key={index} onClick={()=>{this.getLocalDir()}}>{value}</a><br /></section>
        }
        return <section><a className="files" href={this.state.filePath + "/" + value} key={index} onClick={()=>{this.getLocalDir()}}>{value}</a><br /></section>
      })
    } 
    return <section>{this.state.fileContent}</section>
  }

  render() {
    return (
      <div className="breadcrumb">            
        <div className="breadcrumb-container">{this.breadcrumbOutput()}</div>
        <hr />
        <div className="body">{this.outputHandler()}</div>
      </div>
    )
  }
};

export default Breadcrumb;