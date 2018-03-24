import React, { Component } from 'react';
import "./chat-box.css"
import "./send-loader.css"
import "./loading-dots.css"
import Type from 'react-type';
// import TypeWriter from 'react-typewriter';
import Confetti from 'react-confetti'
import BOT_LOGIC from './BotLogic';
import {ANSWER_OPTION, ANSWER_INPUT, FEMALE, MALE, NOT_YET_STR, YES_STR} from './BotLogic';
import MobileHeader from "../Home/Mobile/MobileHeader";


export default class ChatBox extends Component {

    state = {
        currentNode: null,
        inputText: "",
        sendLoading: false,
        showAnswers: false,
        nodeIndex: 0,
        hoveringSubmitButton: false,
    };

    dbUser = null;
    bot = null;
    chatStartDate = null;
    isDate = null;
    textInputRef = null;

    createUser = async (name) => {
        try {
            let data = {
                body: JSON.stringify({name: name}),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
            };
            let res = await fetch("/users/add_user", data);
            if (res && res.status === 200) {
                let resJson = await res.json();
                if (resJson && resJson.user) {
                    this.dbUser = resJson.user;
                    this.chatStartDate = resJson.chatStartDate;
                    console.log(resJson.user);

                    setTimeout(() => this.setState({
                        sendLoading: false,
                        showAnswers: false,
                        currentNode: this.state.currentNode.childNodes()[0].childNodes()[0],
                        inputText: "",
                        nodeIndex: this.state.nodeIndex + 1,
                    }), 2000);
                    this.disableInput = false;
                }
            }
        } catch (error) {
            this.setState({sendLoading: false, showAnswers: false});
            this.disableInput = false;
            console.error(error);
        }
    };

    addDataToDB = async (question, answer, newNode) => {
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

                    setTimeout(() => this.setState({sendLoading: false, showAnswers: false, currentNode: newNode, optionOne:"", optionTwo:"", inputText:"", nodeIndex: this.state.nodeIndex + 1,}), 2000);
                    this.disableInput = false;
                }
            } else {
                this.setState({sendLoading: false, showAnswers: false});
                this.disableInput = false;
                console.error(res);
            }
        } catch(error) {
            this.setState({sendLoading: false, showAnswers: false});
            this.disableInput = false;
            console.error(error);
        }
    };

    handleSubmit = () => {
        if (this.state.inputText !== "") {
            this.textInputRef.blur();
            this.setState({sendLoading: true});
            if (this.state.currentNode.childNodes()[0].data().createUser) {
                this.createUser(this.state.inputText);
            } else {
                this.addDataToDB(this.state.currentNode.data().content, this.state.inputText, this.state.currentNode.childNodes()[0].childNodes()[0]);
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
        if (!this.disableInput && this.state.currentNode.childNodes()[0].data().validator(event.target.value)) {
            this.setState({
                inputText: this.state.currentNode.childNodes()[0].data().changeString(this.state.inputText, event.target.value)
            })
        }

    };
    answerClick = (answer) => {
        this.setState({sendLoading: true});
        if (this.state.currentNode.childNodes()[answer].data().content === NOT_YET_STR) {
            this.isDate = false;
        }
        else if (this.state.currentNode.childNodes()[answer].data().content === YES_STR) {
            this.isDate = true;
        }
        this.addDataToDB(this.state.currentNode.data().content, this.state.currentNode.childNodes()[answer].data().content, this.state.currentNode.childNodes()[answer].childNodes()[0]);
    };
    componentWillMount(){
        //TODO:: fix gender workaround with DB info
        this.bot = BOT_LOGIC;
        BOT_LOGIC.rootNode().data().name = this.props.location.state.name ? this.props.location.state.name : "";
        BOT_LOGIC.rootNode().data().gender = this.props.location.state.name === "טלי"? FEMALE : MALE;
        this.setState({
            currentNode : BOT_LOGIC.rootNode()
        })
    }

    onFinishType = () => {
        this.setState({showAnswers:true});
    };


    render() {
        let answerNode = this.state.currentNode && this.state.currentNode.childNodes()[0] ? this.state.currentNode.childNodes()[0] : null;
        return (
            <div className="chat-box">
                {this.props.location.state.mobile ? <MobileHeader chat={true}/> : ""}
                <div className="text-wrapper">
                    <Type key={this.state.nodeIndex} cursorColor={"#ffe500"} cursorWidth={14} className="text-typer" startTypingDelay={2000} onTypingDone={this.onFinishType} cycleType="reset">
                        {this.state.currentNode.data().content}
                    </Type>
                </div>
                {answerNode && answerNode.data().type === ANSWER_INPUT && this.state.showAnswers?
                    <div className="input-wrapper">
                        <fieldset >
                            <div className="text-input">
                                <form>
                                    <textarea type="text" ref={(input) => { this.textInputRef = input; }} onFocus={() => this.setState({textFocus: true})} onBlur={() => this.setState({textFocus: false})}
                                              placeholder={this.state.textFocus ? "" : this.state.currentNode.childNodes()[0].data().placeholder} dir={answerNode.data().dir ? answerNode.data().dir : "rtl"}  value={this.state.inputText}
                                            className={"user-input " + (answerNode.data().validateSubmit(this.state.inputText) ? "user-input-enabled" : "")} onKeyDown={this.handleKeyDown} onChange={this.inputChange} id="textbox" />
                                </form>
                            </div>
                        </fieldset>
                         {!this.state.sendLoading ?

                            <div className="submit-button" onClick={this.handleSubmit} onMouseLeave={() => this.setState({hoveringSubmitButton:false})} onMouseEnter={() => this.setState({hoveringSubmitButton:true})}
                                                                                        style={{cursor: answerNode.data().validateSubmit(this.state.inputText) ? "pointer":"not-allowed",
                                                                                        backgroundColor: answerNode.data().validateSubmit(this.state.inputText)  && this.state.hoveringSubmitButton ? "rgba(255, 255, 255, 0.9)" : "",
                                                                                            color:answerNode.data().validateSubmit(this.state.inputText)  && this.state.hoveringSubmitButton ? "#022b56" : "white"}}>
                                <img className="submit-border-image" alt="submit-border" src={answerNode.data().validateSubmit(this.state.inputText) ? "/images/send-button-wrapper.png" : "/images/send-button-wrapper-lower-opa.png"}/>
                                <div className="button-text" style={{opacity: answerNode.data().validateSubmit(this.state.inputText) ? "1":"0.5"}}>הבא</div>
                            </div>

                         :
                         <div className="loader">
                             <div className="bar1"/>
                             <div className="bar2"/>
                             <div className="bar3"/>
                             <div className="bar4"/>
                             <div className="bar5"/>
                             <div className="bar6"/>
                         </div>}

                    </div>: ""}
                {this.state.currentNode && this.state.currentNode.childNodes()[0] && this.state.currentNode.childNodes()[0].data().type === ANSWER_OPTION && this.state.showAnswers?
                    <div className="answer-options-wrapper" >
                        {!this.state.sendLoading ?
                        <div style={{display: "flex", flexDirection: "row"}}>
                            {this.state.currentNode.childNodes().map((option, index) => {
                                return (
                                <div className="answer-options" onClick={() => this.answerClick(index)} style={{backgroundColor: option.data().fill ? option.data().fill : ""}}>
                                    <img alt="answer-border" src="/images/answer-option-border.png"/>
                                    <div className="button-text">{option.data().content}</div>
                                </div> )
                            })}
                        </div> :
                        <div className="loader">
                            <div className="bar1"/>
                            <div className="bar2"/>
                            <div className="bar3"/>
                            <div className="bar4"/>
                            <div className="bar5"/>
                            <div className="bar6"/>
                        </div>}
                    </div> : ""}
                {this.state.currentNode && this.state.currentNode.data().completed && this.state.showAnswers?
                    <Confetti width={document.body.clientWidth} height={document.body.clientHeight} numberOfPieces={250} recycle={false} gravity={0.22}/>
                    : ""}
            </div>
        );
    }
}