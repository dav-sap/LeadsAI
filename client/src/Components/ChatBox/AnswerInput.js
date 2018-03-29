import React, { Component } from 'react';
import Loader from "./Loader";

export default class AnswerInput extends Component {
    state = {
        textFocus: false,
        inputText: "",
        sendLoading: false,
    };
    textInputRef = null;
    handleSubmit = () => {
        if (this.state.inputText !== "") {
            this.textInputRef.blur();
            this.setState({sendLoading: true});
            if (this.props.currentNode.childNodes()[0].data().createUser) {
                this.props.createUser(this.state.inputText);
            } else {
                this.props.addDataToDB(this.props.currentNode.data().content, this.state.inputText, this.props.currentNode.childNodes()[0].childNodes()[0]);
            }

        }
    };
    handleKeyDown = (event) => {
        if (event.which === 13 || event.keyCode === 13) {
            this.disableInput = true;
            this.handleSubmit()
        }
    };
    inputChange = (event) => {
        if (!this.disableInput && this.props.currentNode.childNodes()[0].data().validator(event.target.value)) {
            this.setState({
                inputText: this.props.currentNode.childNodes()[0].data().changeString(this.state.inputText, event.target.value)
            })
        }

    };
    isValidAndHover() {
        return this.props.answerNode.data().validateSubmit(this.state.inputText) && this.state.hoveringSubmitButton && !this.mobile;
    }
    render() {
        return <div className="input-wrapper">
            <fieldset>
                <div className={"text-input" + (this.state.textFocus ? " text-input-enabled" : "")}
                     style={{direction: this.props.answerNode.data().dir ? this.props.answerNode.data().dir : "rtl"}}>
                    <form>
                                    <textarea type="text" ref={(input) => {this.textInputRef = input;}}
                                              onFocus={() => this.setState({textFocus: true})} onBlur={() => this.setState({textFocus: false})}
                                              placeholder={this.state.textFocus ? "" : this.props.currentNode.childNodes()[0].data().placeholder}
                                              value={this.state.inputText}
                                              className={"user-input"} onKeyDown={this.handleKeyDown}
                                              onChange={this.inputChange} id="textbox"/>
                    </form>
                </div>
            </fieldset>
            {!this.state.sendLoading ?

                <div className="submit-button" onClick={this.handleSubmit}
                     onMouseLeave={() => this.setState({hoveringSubmitButton: false})}
                     onMouseEnter={() => this.setState({hoveringSubmitButton: true})}
                     style={{cursor: this.isValidAndHover() ? "pointer" : "not-allowed"}}>
                    <svg className="svg-border" width="201" height="52" opacity={this.props.answerNode.data().validateSubmit(this.state.inputText) ? "1" : "0.5"}>
                        <defs>
                            <linearGradient id="borderGradient">
                                <stop offset="0%"  stopColor="#02c0fd"/>
                                <stop offset="30%" stopColor="#fecf03"/>
                                <stop offset="100%" stopColor="#fd504f"/>
                            </linearGradient>
                        </defs>
                        <rect className="border-rect-next" rx="18" ry="18" style={{fill: (this.isValidAndHover() ? "rgba(255, 255, 255, 0.9)" : "")}}/>
                        <text x="50%" y="50%"  textAnchor="middle" alignmentBaseline="middle" fontFamily="Heebo" fontSize="18.8" fill={this.isValidAndHover() ? "#022b56" :"white"}>הבא</text>
                    </svg>
                </div>

                :
                <Loader/>}

        </div>
    }
}