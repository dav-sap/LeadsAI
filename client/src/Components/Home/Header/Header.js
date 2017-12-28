import React, { Component } from 'react';
import {Icon} from 'antd';
import './header.css'
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (

            <div className="header">

                <Icon type="book" style={{fontSize: '50px'}}/>
                <Icon type="cloud-download-o" style={{fontSize: '50px'}}/>
                <Icon type="apple" style={{fontSize: '50px'}}/>

            </div>
        );
    }
}