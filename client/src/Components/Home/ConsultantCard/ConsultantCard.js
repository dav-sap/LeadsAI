import React, { Component } from 'react';
import './consultant-card.css'
import {Icon} from 'antd';
export default class ConsultantCard extends Component {

    render() {
        return (

            <div style={{opacity: this.props.opacity, zIndex: this.props.opacity === 1 ? 1 : 0}} className="consultant-card">
                <div className="consultant-wrapper">
                    {this.props.info.picture ? <img className="consultant-img" alt="Consultant" src={"data:" + (this.props.info.picture.contentType) + ";base64," + (new Buffer(this.props.info.picture.data).toString('base64'))}/> : ""}


                    <div className="name-arrow-wrapper">
                        <div className="position-wrapper">
                        <Icon className="arrow arrow-left" type="arrow-left" onClick={() => this.props.switchConsultant("left", this.props.index)}/>
                        <div className="consultant-name">{this.props.info.name.split(' ').map((name, index) => <div key={index}>{name}</div>)}</div>
                        <Icon className="arrow arrow-right" type="arrow-right" onClick={() =>this.props.switchConsultant("right", this.props.index)}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}