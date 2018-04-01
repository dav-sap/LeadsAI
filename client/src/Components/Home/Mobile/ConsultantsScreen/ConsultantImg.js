import React, { Component } from 'react';

export default class ConsultantImg extends Component {

    render() {
        return (

            <div className="consultant-card">
                {this.props.info.profile_pic ?
                    <div className="consultant-img-wrapper"
                         onClick={ () => {setTimeout( () => this.props.closeScreen(), 40);setTimeout( () => this.props.history.push({pathname:'/chat/' + this.props.info.name,
                             state: { name: this.props.info.name, email:this.props.info.email, mobile: true }}), 1700)}}>
                        <img className="consultant-img" alt="Consultant"
                             src={"data:" + (this.props.info.profile_pic.contentType) + ";base64," + (new Buffer(this.props.info.profile_pic.data).toString('base64'))}/>
                    </div>  : ""}
                <div className="consultant-name">{this.props.info.name}</div>

            </div>
        );
    }
}