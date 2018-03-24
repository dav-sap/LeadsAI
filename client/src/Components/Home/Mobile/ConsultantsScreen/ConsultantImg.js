import React, { Component } from 'react';

export default class ConsultantImg extends Component {

    state = {
        hover:false
    };

    render() {
        return (

            <div className="consultant-card">
                {this.props.info.profile_pic ?
                    <div className="consultant-img-wrapper"  style={{top: this.state.hover ? "-5px" : "0"}}
                         onClick={ () => {setTimeout( () => this.props.closeScreen(), 40);setTimeout( () => this.props.history.push({pathname:'/chat/' + this.props.info.name,
                             state: { name: this.props.info.name, email:this.props.info.email, mobile: true }}), 1700)}}>
                        <img className="consultant-img" alt="Consultant" onMouseEnter={() => this.setState({hover:true})} onMouseLeave={() => this.setState({hover:false})}
                             src={"data:" + (this.props.info.profile_pic.contentType) + ";base64," + (new Buffer(this.props.info.profile_pic.data).toString('base64'))}/>
                        <img className="consultant-img-bw" alt="Consultant" style={{opacity: this.state.hover ? 1 : 0}} onMouseEnter={() => this.setState({hover:true})} onMouseLeave={() => this.setState({hover:false})}
                             src={"data:" + (this.props.info.profile_pic_bw.contentType) + ";base64," + (new Buffer(this.props.info.profile_pic_bw.data).toString('base64'))}/>
                    </div>  : ""}
                <div className="consultant-name">{this.props.info.name}</div>

            </div>
        );
    }
}