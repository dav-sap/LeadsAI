import React, { Component } from 'react';
import './answer-input.css'
import NextButton from "../NextButton/NextButton";

export default class AnswerInput extends Component {
    state = {
        inputText: "",
        enterClicked: false
    };


    handleKeyDown = (event) => {
        if ((event.which === 13 || event.keyCode === 13) && this.props.answerNode.data().validateSubmit(this.state.inputText)) {
            this.disableInput = true;
            this.setState({
                enterClicked: true
            })
            document.getElementById("textbox").blur()
        }
    };
    inputChange = (event) => {
        if (!this.disableInput && this.props.answerNode.data().validator(event.target.value)) {
            this.setState({
                inputText: this.props.answerNode.data().changeString(this.state.inputText, event.target.value)
            })
        }

    };

    render() {
        return <div className="input-wrapper" >
            <fieldset>

                <textarea type="text"
                          placeholder={this.props.currentNode.childNodes()[0].data().placeholder}
                          value={this.state.inputText}
                          style={{direction: this.props.answerNode.data().dir ? this.props.answerNode.data().dir : "rtl"}}
                          className="user-input" onKeyDown={this.handleKeyDown}
                          onChange={this.inputChange} id="textbox"/>

                <div className="text-input" />
            </fieldset>
            <NextButton inputText={this.state.inputText} currentNode={this.props.currentNode} nextButton={true} content={"הבא"} error={this.props.error}
                        answerNode={this.props.answerNode} createUser={this.props.createUser} addDataToDB={this.props.addDataToDB} enterClicked={this.state.enterClicked}/>

        </div>
    }
}