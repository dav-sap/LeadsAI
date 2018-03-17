import React, { Component } from 'react';
import "./chat-box.css"
import "./send-loader.css"
import "./loading-dots.css"
import Typing from 'react-typing-animation';
// import TypeWriter from 'react-typewriter';
import {TITLES} from './../Consts'
import BOT_LOGIC from './BotLogic';
import {QUESTION, ANSWER} from './BotLogic';
import TextBox from "./TextBox";
const MOVES = {QUESTION: "question", ANSWERS: "answers", INPUT: "input"};

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatStarting: false,
            messages: [],
            userInput: false,
            answerOptions: false,
            optionOne: "",
            optionTwo: "",
            currentNode: null,
            inputText: "",
            sendLoading: false,
            msgLetter: 0
        };

        this.dbUser = null;
        this.bot = null;

    }

    createUser = async (name) => {
        try {
            let data = {
                body: JSON.stringify({name: name}),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            };
            let res = await fetch("/users/add_user",data);
            if (res && res.status === 200) {
                let resJson = await res.json();
                if (resJson && resJson.user) {
                    this.dbUser = resJson.user;
                    this.chatStartDate = resJson.chatStartDate;
                    console.log(resJson.user);
                }
            }
        } catch(error) {
            console.error(error);
        }
    };
    addDataToDB = async (question, answer) => {
        try {
            let data = {
                body: JSON.stringify({_id: this.dbUser._id, startDate: this.chatStartDate, question:question, answer: answer}),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            };
            let res = await fetch("/users/add_chat_answer",data);
            if (res && res.status === 200) {
                let resJson = await res.json();
                if (resJson && resJson.info) {
                    // console.log(resJson.info);
                }
            } else {
                throw {status: res.status, error: res}
            }
        } catch(error) {
            console.error(error);
        }
    };
    addMsg = () => {
        console.log("ADD MSG");
        if (this.state.currentNode) {
            if (this.state.currentNode.parentNode() && this.state.currentNode.parentNode().childNodes().length > 1 && this.state.currentNode.data().type === ANSWER) {
                this.setState({
                    answerOptions: true,
                    optionOne: this.state.currentNode.parentNode().childNodes()[0].data().content,
                    optionTwo: this.state.currentNode.parentNode().childNodes()[1].data().content,
                })
            } else if (this.state.currentNode.data().type === ANSWER && this.state.currentNode.data().content === "") {
                this.setState({
                    userInput: true
                })
            } else if (this.state.currentNode.data().type === QUESTION) {
                this.setState({
                    messages: [...this.state.messages, {
                        type: this.state.currentNode.data().type,
                        content: this.state.currentNode.data().content,
                        close: this.state.currentNode.data().close,

                    }],
                    currentNode: this.state.currentNode.childNodes()[0],
                    loadingMsg: true,
                }, () => setTimeout(() => this.setState({loadingMsg: false}), 1800));
            }
        }
    };
    goToChat = () => {
        this.props.switchScreenFunc();
        setTimeout(() => this.setState({chatStarting: true}), 2500);
        setTimeout(() => this.addMsg(), 2800);
    };
    handleSubmit = () => {
        this.setState({sendLoading: true});
        if (this.state.currentNode.data().createUser) {
            this.createUser(this.state.inputText);
        } else {
            this.addDataToDB(this.state.currentNode.parentNode().data().content, this.state.inputText)
        }
        setTimeout(() => {
            this.setState({
                messages: [...this.state.messages, {type:ANSWER, content: this.state.inputText}],
                currentNode: this.state.currentNode.childNodes()[0],
            }, () => {
            this.setState({userInput: false, inputText: "", sendLoading: false,});
            this.disableInput = false;
            this.addMsg()
        })}, 1200);
    };
    handleKeyDown = (event) => {
        if (event.which === 13 || event.keyCode === 13) {
            this.disableInput = true;
            this.handleSubmit()
        }
    };
    inputChanged = (event) => {
        // let val = "";
        // let key = event.keyCode || event.charCode;
        // if( key === 8 || key === 46 ) {
        //     val = event.target.value
        // } else {
        //     val = event.target.value.replace("|", "") + " | ";
        // }
        if (!this.disableInput) {
            this.setState({
                inputText: event.target.value
            });
        }

    };
    answerClick = (answer) => {
        this.addDataToDB(this.state.currentNode.parentNode().data().content, this.state.currentNode.parentNode().childNodes()[answer].data().content);
        this.setState({
            messages: [...this.state.messages, {type:ANSWER, content: this.state.currentNode.parentNode().childNodes()[answer].data().content}],
            currentNode: this.state.currentNode.parentNode().childNodes()[answer].childNodes()[0]
        }, () => {
             setTimeout(() => this.addMsg(), 2000);
            this.setState({
                answerOptions: false,
                optionOne:"",
                optionTwo:"",
            })
        })
    };
    componentDidMount() {
        this.bot = BOT_LOGIC;
        this.setState({
            currentNode : BOT_LOGIC.rootNode()
        })
    }
    onFinishType = () => {
        console.log("FINSIHED TYPE");
        this.addMsg();
    }

    render() {

        return (
            <div  className="chat-box" ref="chatBox" id="chatBox">
                {/*<div className="start-convo-button" onClick={this.goToChat} id={this.state.chatStarting ? "start-convo-button" : ""}*/}
                     {/*style={{top: this.state.chatStarting ? "0px" : this.props.chatClicked ? "-600px" : "-185px"}}>*/}

                    {/*<div className="button-text">{TITLES.BUTTON_START_CONVO}</div>*/}
                    {/*<div className="button-fade"/>*/}
                {/*</div>*/}
                {/*{this.state.messages.map((message, index) => {*/}
                    {/*return <div className="msg-wrapper"><div key={index} className={"message " + (message.type === ANSWER ? "user-message " : "bot-message ")*/}
                                                    {/*+ (message.close ? "close-bot-message" : "")}>*/}
                            {/*{this.state.loadingMsg && message.type === QUESTION && index === this.state.messages.length - 1? <div id="wave">*/}
                                {/*<span className="dot"/>*/}
                                {/*<span className="dot"/>*/}
                                {/*<span className="dot"/>*/}
                            {/*</div> : <p className="message-text">*/}
                                {/*{message.type === ANSWER  ? <span>{message.content}</span> : <Typing onFinishedTyping={this.onFinishType}>*/}
                                {/*<span>{message.content}</span>*/}
                                {/*/!*<Typing.Backspace count={20} />*!/*/}
                            {/*</Typing>}*/}
                            {/*</p>}*/}
                    {/*</div></div>*/}
                {/*})}*/}
                {/*{this.state.userInput ?*/}
                {/*<fieldset className="input-wrapper">*/}
                    {/*<div className="text-input">*/}
                        {/*/!*<input placeholder={"שם מלא"} type="text" dir="rtl" className="user-input" onKeyDown={this.handleSubmit} onChange={this.inputChanged}/>*!/*/}
                        {/*/!*<div className="input-text">שם מלא</div>*!/*/}
                        {/*<form>*/}
                            {/*<textarea type="text" placeholder="שם מלא |" dir="rtl"  value={this.state.inputText}*/}
                                      {/*className="user-input" onKeyDown={this.handleKeyDown} onChange={this.inputChanged} id="textbox" />*/}
                        {/*</form>*/}
                    {/*</div>*/}
                    {/*<div className="submit-button" onClick={this.handleSubmit}>*/}
                        {/*{!this.state.sendLoading ? <div>שלח</div> :*/}
                            {/*<div className="loader">*/}
                                {/*<svg className="circular" viewBox="25 25 50 50">*/}
                                {/*<circle className="path" cx="50" cy="50" r="20"/>*/}
                                {/*</svg>*/}
                            {/*</div>}*/}
                        {/*</div>*/}
                {/*</fieldset> : ""}*/}
                {/*{this.state.answerOptions ?*/}
                    {/*<div className="answer-options-wrapper">*/}
                        {/*<div className="option-1 answer-options" onClick={() => this.answerClick(0)}>{this.state.optionOne}</div>*/}
                        {/*<div className="option-2 answer-options" onClick={() => this.answerClick(1)}>{this.state.optionTwo}</div>*/}
                    {/*</div> : ""}*/}
                <TextBox/>
            </div>
        );
    }
}