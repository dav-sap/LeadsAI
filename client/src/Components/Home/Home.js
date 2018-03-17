import React, { Component } from 'react';
import './home.css';
import 'antd/dist/antd.css';
import Title from './Title/Title';
import Header from './Header/Header'
import Footer from './Footer/Footer'
import ConsultantsBody from "./ConsultantsBody/ConsultantsBody";
import ChatBox from "../ChatBox/ChatBox";

export default class Home extends Component {

    render() {
        return (
            <div className="home" >
                <Title/>
                <ConsultantsBody history={this.props.history}/>
            </div>
        );
    }
}