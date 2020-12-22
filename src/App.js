import React, { Component } from 'react';
import {BrowserRouter, Route} from "react-router-dom"; 

import Breadcrumb from './components/Breadcrumb';
import './App.css';

class App extends Component {

  
	render() {
    return (
      <BrowserRouter>
        
        <Route path="" component={Breadcrumb}/>
        
      </BrowserRouter>
    );
  }
}

export default App;