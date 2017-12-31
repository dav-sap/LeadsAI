import React, { Component } from 'react';
import './home.css';
import 'antd/dist/antd.css';
import Title from './Title/Title';
import Header from './Header/Header'
import Footer from './Footer/Footer'
import ConsultantsBody from "./ConsultantsBody/ConsultantsBody";

export default class Home extends Component {
    state = {
        position: "relative",
        top: "0px",
    };
    switchScreen() {
        this.setState({
            top: "2500px",
        })
    }
    render() {
        return (
            <div className="home" >
                <Header/>
                <div className="all-body" style={{top:this.state.top}}>
                    <Title/>
                    <ConsultantsBody />
                </div>
                <Footer/>
            </div>
        );
    }
}