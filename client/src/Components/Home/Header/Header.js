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
                <img src={process.env.PUBLIC_URL + "/images/logo.png"} className="Logo"/>
            </div>
        );
    }
}