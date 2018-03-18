import React, { Component } from 'react';
import "./chat-box.css"
import "./send-loader.css"
import "./loading-dots.css"
import Type from 'react-type';
// import TypeWriter from 'react-typewriter';
import Confetti from 'react-confetti'
import BOT_LOGIC from './BotLogic';
import {QUESTION, ANSWER_OPTION, ANSWER_INPUT} from './BotLogic';


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

                    this.setState({
                        sendLoading: false,
                        showAnswers: false,
                        currentNode: this.state.currentNode.childNodes()[0].childNodes()[0],
                        inputText: "",
                        nodeIndex: this.state.nodeIndex + 1,
                    });
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
                    this.setState({sendLoading: false, showAnswers: false, currentNode: newNode, optionOne:"", optionTwo:"", inputText:"", nodeIndex: this.state.nodeIndex + 1,});
                    this.disableInput = false;
                }
            } else {
                throw {status: res.status, error: res}
            }
        } catch(error) {
            this.setState({sendLoading: false, showAnswers: false});
            this.disableInput = false;
            console.error(error);
        }
    };

    handleSubmit = () => {
        if (this.state.inputText !== "") {
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
        this.addDataToDB(this.state.currentNode.data().content, this.state.currentNode.childNodes()[answer].data().content, this.state.currentNode.childNodes()[answer].childNodes()[0]);
    };
    componentWillMount(){
        this.bot = BOT_LOGIC;
        this.setState({
            currentNode : BOT_LOGIC.rootNode()
        })
    }

    onFinishType = () => {
        console.log("FINSIHED TYPE");
        this.setState({showAnswers:true});
        // this.addMsg();
    };

    render() {

        return (
            <div className="chat-box">
                <div className="text-wrapper">
                    <Type key={this.state.nodeIndex} cursorColor={"#ffe500"} cursorWidth={14} className="text-typer" onTypingDone={this.onFinishType} cycleType="reset">
                        {this.state.currentNode.data().content}
                    </Type>
                </div>
                {this.state.currentNode && this.state.currentNode.childNodes()[0] && this.state.currentNode.childNodes()[0].data().type === ANSWER_INPUT && this.state.showAnswers?
                    <div className="input-wrapper">
                        <fieldset >
                            <div className="text-input">
                                <form>
                                    <textarea type="text" placeholder={this.state.currentNode.childNodes()[0].data().placeholder} dir="rtl"  value={this.state.inputText}
                                            className="user-input" onKeyDown={this.handleKeyDown} onChange={this.inputChanged} id="textbox" />
                                </form>
                            </div>
                        </fieldset>
                         {!this.state.sendLoading ?

                            <div className="submit-button" onClick={this.handleSubmit} onMouseLeave={() => this.setState({hoveringSubmitButton:false})} onMouseEnter={() => this.setState({hoveringSubmitButton:true})}
                                                                                        style={{cursor: this.state.inputText !== ""? "pointer":"not-allowed",
                                                                                        backgroundColor: this.state.inputText !== ""  && this.state.hoveringSubmitButton ? "#828282": "" }}>
                                <img className="submit-border-image" src={this.state.inputText !== "" ? "/images/send-button-wrapper.png" : "/images/send-button-wrapper-lower-opa.png"}/>
                                <div className="button-text" style={{opacity: this.state.inputText !== ""? "1":"0.5"}}>שלח</div>
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
                    <div className="answer-options-wrapper">
                        {this.state.currentNode.childNodes().map((option, index) => {
                            return (
                            <div className="answer-options" onClick={() => this.answerClick(index)} style={{backgroundColor: option.data().fill ? option.data().fill : ""}}>
                                <img src="/images/answer-option-border.png"/>
                                <div className="button-text">{option.data().content}</div>
                            </div> )
                        })}

                    </div> : ""}
                {this.state.currentNode && this.state.currentNode.data().completed && this.state.showAnswers?
                    <Confetti width={document.body.clientWidth} height={document.body.clientHeight} numberOfPieces={500}/>
                    : ""}
            </div>
        );
    }
}