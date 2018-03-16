import React, { Component } from 'react';
import './header.css'
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (

            <div className="header">
                <img alt="logo" src={"/images/logo.png"} className="Logo"/>
            </div>
        );
    }
}