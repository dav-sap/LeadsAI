import React, { Component } from 'react';
import {TITLES} from './../../Consts';
import './title.css';
export default class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="title">
                <div className="first-line">{TITLES.TOP}</div>
                <div className="second-line">{TITLES.MIDDLE}</div>
                <div className="third-line">{TITLES.BOTTOM}</div>
            </div>
        );
    }
}