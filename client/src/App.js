import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ChatBox from './Components/ChatBox/ChatBox.js';

export default class App extends Component {
	constructor(props) {
		super(props);
		// this.state = {users: []};
	}
	

  componentDidMount() {
    // fetch('/users/get_users')
    //   .then(res => res.json())
    //   .then(json => {
    //       if (json.success) {
    //           console.log(json)
    //           this.setState({users: json.users})
    //       }
    //   });
  }
  render() {
    return (
        <div className="App">

          <ChatBox/>
        </div>
    );
  }
}