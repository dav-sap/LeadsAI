import React, { Component } from 'react';
import './home.css';
import 'antd/dist/antd.css';
import Title from './Title/Title';
import Header from './Header/Header'
import ConsultantsBody from "./ConsultantsBody/ConsultantsBody";

export default class Home extends Component {

    render() {
        return (
            <div className="home">
                <Header/>

                <hr className="header-separator"/>
                <div className="all-body">
                <Title/>
                <ConsultantsBody />
                </div>
            </div>
        );
    }
}