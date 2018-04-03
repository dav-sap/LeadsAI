import React, { Component } from 'react';
import Loader from "./../Loader";
import './next-button.css'

export default class NextButton extends Component {
    state = {

        sendLoading: false,
    };

    handleSubmit = () => {
        if (this.props.onClick) {
            this.props.onClick();
        } else {
            if (this.props.inputText !== "") {
                this.setState({sendLoading: true});
                if (this.props.currentNode.childNodes()[0].data().createUser) {
                    this.props.createUser(this.props.inputText);
                } else {
                    this.props.addDataToDB(this.props.currentNode.data().content, this.props.inputText, this.props.currentNode.childNodes()[0].childNodes()[0]);
                }

            }
        }
    };
    isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({
                sendLoading: false
            })
        }
        if (nextProps.enterClicked) {
            this.handleSubmit();
        }

    }

    render() {
        let width = this.props.nextButton ? 203 : 123;
        let margin = this.props.nextButton ? "auto" : "15px";

        return (
            <div className="input-button-wrapper">
                {!this.props.answerNode ? <div></div> :
                <div style={{position: "relative", top: "25px", margin: "auto", visibility: this.state.sendLoading ? "hidden" :"visible",
                            height: "54px", width:(width + 2).toString() + "px", marginRight: margin, marginLeft: margin}}>
                <button className="submit-button no-select" onClick={this.handleSubmit} disabled={!this.props.answerNode.data().validateSubmit(this.props.inputText)}
                     style={{cursor: this.props.answerNode.data().validateSubmit(this.props.inputText)? "pointer" :  "not-allowed",
                         width: (width - 2).toString() + ".2px", }}>

                    <div className="button-text" style={{opacity: this.props.answerNode.data().validateSubmit(this.props.inputText) ? "1" : "0.5"}}>
                        {this.props.content}
                    </div>
                </button>
                <svg className="svg-border" width={(width + 2).toString()} opacity={this.props.answerNode.data().validateSubmit(this.props.inputText) ? "1" : "0.5"}>
                    <defs>
                        <linearGradient id="borderGradient">
                            <stop offset="0%"  stopColor="#02c0fd"/>
                            <stop offset="30%" stopColor="#fecf03"/>
                            <stop offset="100%" stopColor="#fd504f"/>
                        </linearGradient>
                    </defs>
                    <g>
                        <rect className="border-rect" width={width.toString()} height="52" rx="18" ry="18" x="1" y="1"/>

                    </g>

                </svg>
                </div>}

                <div className="loader-wrapper" style={{visibility: !this.state.sendLoading ? "hidden" :"visible"}}>
                    <Loader/>
                </div>
            </div>
        )
    }
}