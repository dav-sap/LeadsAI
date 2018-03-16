import React, { Component } from 'react';
import './home.css';
import 'antd/dist/antd.css';
import Title from './Title/Title';
import Header from './Header/Header'
import Footer from './Footer/Footer'
import ConsultantsBody from "./ConsultantsBody/ConsultantsBody";
import ChatBox from "../ChatBox/ChatBox";

export default class Home extends Component {
    state = {
        chatClicked: false,
    };
    switchScreen = () => {
        this.setState({
            chatClicked: true,
        })
    };
    render() {
        return (
            <div className="home" >
                <Header/>
                <div className="all-body" style={{top:this.state.chatClicked ? "-1000px" : "0px"}}>
                    <Title/>
                    <ConsultantsBody />
                </div>
                <ChatBox chatClicked={this.state.chatClicked} switchScreenFunc={this.switchScreen} />
                <Footer/>
            </div>
        );
    }
}