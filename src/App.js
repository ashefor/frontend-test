import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router
} from "react-router-dom";
import Cockpit from './Cockpit';



class App extends Component {
  
  render() {
    return (
      <Router>
       <Cockpit />
      </Router>
    );
  }
}

export default App
