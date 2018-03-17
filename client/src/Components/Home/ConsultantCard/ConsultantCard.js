import React, { Component } from 'react';
import './consultant-card.css'
import {Icon} from 'antd';
export default class ConsultantCard extends Component {

    state = {
        hover:false
    }


    render() {
        return (

            <div className="consultant-card">
                {this.props.info.picture ?
                    <div className="consultant-img-wrapper"  style={{top: this.state.hover ? "-5px" : "0"}} onClick={ () => this.props.history.push('/chat/' + this.props.info.name)}>
                    <img className="consultant-img" alt="Consultant"  onMouseEnter={() => this.setState({hover:true})} onMouseLeave={() => this.setState({hover:false})}
                        src={"data:" + (this.props.info.picture.contentType) + ";base64," + (new Buffer(this.props.info.picture.data).toString('base64'))}/>
                <div className="glow-low" style={{filter: this.state.hover ? "blur(6.2px)" : "blur(0)"}}/>
                <div className="glow-high" style={{filter: this.state.hover ? "blur(16px)" : "blur(0)"}}/>
            </div>  : ""}
            <div className="consultant-name">{this.props.info.name}</div>

            </div>
        );
    }
}