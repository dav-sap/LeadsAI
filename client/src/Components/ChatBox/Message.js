import React, { Component } from 'react';
import './message.css'
export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("constructor");
    }


    render() {
        return (
            <div className={this.props.className} style={{}}>
                {this.props.text}
            </div>
        );
    }
}