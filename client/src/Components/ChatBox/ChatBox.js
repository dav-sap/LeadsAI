import React, { Component } from 'react';
import "./chat-box.css"

import Message from "./Message";
export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // {messageText: , messageNum:}
            botMessages: [],
            userMessages: [],
        };
        this.allMessagesNum = 1;
        this.questions = ["question 1", "question 2", "question 3", "question 4", "question 5"];
        this.answers = ["2", "1", "3", "4", "5", "6","7"];

        this.answerToQuestion = [
            {answer:this.answers[0], question: this.questions[3]},
            {answer:this.answers[1], question: this.questions[4]},
            {answer:this.answers[3], question: this.questions[0]},
            {answer:this.answers[4], question: this.questions[1]},
            {answer:this.answers[6], question: undefined}
        ];
        this.questionToAnswers = [
            {answers:[this.answers[0]], question: this.questions[3]},
            {answers:[this.answers[1]], question: this.questions[4]},
            {answers:[this.answers[3]], question: this.questions[0]},
            {answers:[this.answers[4]], question: this.questions[1]},
            {answers:[this.answers[6]], question: this.questions[2]}
        ];

    }
    componentDidMount() {
        this.setState({
            botMessages: [{text: this.questions[0], msgNum:0}]
        });
        this.allMessagesNum++;
    }
    componentDidUpdate() {
        let messageBody = document.getElementById('chatBox');
        if (messageBody) {
            this.refs.chatBox.scrollTop = messageBody.scrollHeight;
        }
    }
    addMsg(newMsg) {
        this.setState({
            userMessages: [...this.state.userMessages, {text:newMsg.value, msgNum:this.allMessagesNum}]
        });
        this.allMessagesNum++;

    }
    render() {
        // let numOfMsgs = this.state.botMessages.length + this.state.userMessages.length;

        return (
            <div>
                <div  className="chat-box" ref="chatBox" id="chatBox">
                {this.state.botMessages.map((msg, index) => {
                    return <Message className="bot-message" key={index} text={msg.text} msgNum={msg.msgNum+ 1}/>
                })};
                {this.state.userMessages.map((msg, index) => {
                    return <Message className="user-message" key={index} text={msg.text} msgNum={msg.msgNum+ 1}/>
                })};
                </div>
                <div>
                <input type="text" id="currentMsg" name="currentMsg"/>
                <button onClick={this.addMsg.bind(this,document.getElementById("currentMsg"))}>Enter</button>
                </div>
            </div>
        );
    }
}