import React, { Component } from 'react';
import './consultant-card.css'
import {TITLES} from './../../Consts';
import {Icon} from 'antd';
export default class ConsultantCard extends Component {

    render() {
        return (

            <div style={{opacity: this.props.opacity, zIndex: this.props.opacity === 1 ? 1 : 0}} className="consultant-card">
                {this.props.info.picture ? <img height="280" width="550" src={"data:" + (this.props.info.picture.contentType) + ";" + "base64," + (new Buffer(this.props.info.picture.data).toString('base64'))}/> : ""}

                <Icon className="arrow arrow-left" type="arrow-left" onClick={() => this.props.switchConsultant("left", this.props.index)}/>
                <div className="name-button-wrapper">
                    <div className="consultant-name">{this.props.info.name.split(' ').map(name => <div>{name}</div>)}</div>
                    <div className="start-convo-button">
                        <div className="button-text">{TITLES.BUTTON_START_CONVO}</div>
                        <div className="button-fade"/>
                    </div>
                </div>
                <Icon className="arrow" type="arrow-right" onClick={() =>this.props.switchConsultant("right", this.props.index)}/>
            </div>
        );
    }
}