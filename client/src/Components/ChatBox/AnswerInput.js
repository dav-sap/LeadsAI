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
        if ((event.which === 13 || event.keyCode === 13) && this.props.answerNode.data().validateSubmit(this.state.inputText)) {
            this.disableInput = true;
            this.handleSubmit()
        }
    };
    inputChange = (event) => {
        if (!this.disableInput && this.props.answerNode.data().validator(event.target.value)) {
            this.setState({
                inputText: this.props.answerNode.data().changeString(this.state.inputText, event.target.value)
            })
        }

    };
    isValidAndHover() {
        return this.props.answerNode.data().validateSubmit(this.state.inputText) && this.state.hoveringSubmitButton && !this.mobile;
    }
    render() {
        return <div className="input-wrapper" >
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
                <div className="input-button-wrapper">
                    <div className="submit-button" onClick={this.handleSubmit}
                         onMouseLeave={() => this.setState({hoveringSubmitButton: false})}
                         onMouseEnter={() => this.setState({hoveringSubmitButton: true})}
                         style={{cursor: this.isValidAndHover() ? "pointer" : "not-allowed", visibility: this.state.sendLoading ? "hidden" :"visible"}}>
                        <svg className="svg-border" width="203" height="54" opacity={this.props.answerNode.data().validateSubmit(this.state.inputText) ? "1" : "0.5"}>
                            <defs>
                                <linearGradient id="borderGradient">
                                    <stop offset="0%"  stopColor="#02c0fd"/>
                                    <stop offset="30%" stopColor="#fecf03"/>
                                    <stop offset="100%" stopColor="#fd504f"/>
                                </linearGradient>
                            </defs>
                            <rect className="border-rect-next" rx="18" ry="18" x="1" y="1" height="51.8" width="201" stroke="url(#borderGradient)" style={{fill: (this.isValidAndHover() ? "rgba(255, 255, 255, 0.9)" : "")}}/>
                            <text x="50%" y="50%"  textAnchor="middle" alignmentBaseline="middle" fontFamily="Heebo" fontSize="18.8" fill={this.isValidAndHover() ? "#022b56" :"white"}>הבא</text>
                        </svg>
                    </div>

                    <div className="loader-wrapper" style={{visibility: !this.state.sendLoading ? "hidden" :"visible"}}>
                        <Loader/>
                    </div>
                </div>

        </div>
    }
}