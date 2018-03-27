import React, { Component } from 'react';
import "./chat-box.css"
import "./send-loader.css"
import "./loading-dots.css"
import Type from 'react-type';
// import TypeWriter from 'react-typewriter';
import Confetti from 'react-confetti'
// import BOT_LOGIC from './GraphBot';
import sendButtonBorderHigh from './send-button-wrapper.png'
import sendButtonBorderLow from './send-button-wrapper-lower-opa.png'
import {ANSWER_OPTION, ANSWER_INPUT, WEB_BOT, MOBILE_BOT} from './GraphBot';
import MobileHeader from "../Home/Mobile/MobileHeader";
import Typist from 'react-typist';
import Loader from "./Loader";

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
    mobile = false;
    borderTagHighOpacity = <img className="submit-border-image" alt="submit-border" src={sendButtonBorderHigh}/>;
    borderTagLowOpacity = <img className="submit-border-image" alt="submit-border" src={sendButtonBorderLow}/>;

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
                    console.log(resJson.user.name);
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

                    setTimeout(() => this.setState({sendLoading: false, showAnswers: false, currentNode: newNode, inputText:"", nodeIndex: this.state.nodeIndex + 1,}), 2000);
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
        let nextNode = this.bot.traverser().searchBFS(function(data){
            return data.stringToPrint === answer;
        });
        this.addDataToDB(this.state.currentNode.data().content, answer, nextNode.childNodes()[0]);
    };
    chooseConsultant = ()=> {
        this.setState({sendLoading: true});
        setTimeout(() => this.setState({sendLoading: false, showAnswers: false, currentNode: this.state.currentNode.childNodes()[0].childNodes()[0], nodeIndex: this.state.nodeIndex + 1,}), 2000);
    };

    componentWillMount(){
        if (this.props.location.state.mobile) {
            this.bot = MOBILE_BOT;
            this.mobile = true;
            this.bot.rootNode().childNodes()[0].data().consultants = this.props.location.state.consultants;
            this.bot.rootNode().childNodes()[0].data().history = this.props.history;
            this.bot.rootNode().childNodes()[0].data().onClick = this.chooseConsultant;
        } else {
            this.bot = WEB_BOT;
        }
        this.setState({
            currentNode : this.bot.rootNode()
        })
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.currentNode.data().getName) {
            nextState.currentNode.data().name = this.dbUser.name;

        } if (nextState.currentNode.data().getConsultantName) {
            nextState.currentNode.data().consultantName = this.props.location.state.name === "טלי" ?  "טלי תיצור" : this.props.location.state.name + " יצור";
        }if (nextState.currentNode.childNodes()[0] && nextState.currentNode.childNodes()[0].data().getFunc) {
            let node = this.bot.traverser().searchBFS(function(data){
                return data.content === nextState.currentNode.data().content;
            });
            node.childNodes().map(childNode => {console.log(childNode);childNode.data().onClick = this.answerClick;});
        }
    }
    onFinishType = () => {
        this.setState({showAnswers:true});
    };


    render() {
        let answerNode = this.state.currentNode && this.state.currentNode.childNodes()[0] ? this.state.currentNode.childNodes()[0] : null;
        return (
            <div className="chat-box">
                {this.mobile ? <MobileHeader/> : ""}
                <div className="text-wrapper"  style={{direction: this.state.currentNode.data().dir ? this.state.currentNode.data().dir : "rtl"}}>
                    <Typist key={this.state.nodeIndex} avgTypingDelay={25} className="text-typer" startDelay={1500} onTypingDone={this.onFinishType} cycleType="reset">
                        {this.state.currentNode.data().content}
                    </Typist>

                </div>
                {answerNode && answerNode.data().type === ANSWER_INPUT && this.state.showAnswers?
                    <div className="input-wrapper">
                        <fieldset >
                            <div className={"text-input" + (this.state.textFocus ? " text-input-enabled" : "")} style={{direction: answerNode.data().dir ? answerNode.data().dir : "rtl"}}>
                                <form>
                                    <textarea type="text" ref={(input) => { this.textInputRef = input; }} onFocus={() => this.setState({textFocus: true})} onBlur={() => this.setState({textFocus: false})}
                                              placeholder={this.state.textFocus ? "" : this.state.currentNode.childNodes()[0].data().placeholder}  value={this.state.inputText}
                                            className={"user-input"} onKeyDown={this.handleKeyDown} onChange={this.inputChange} id="textbox" />
                                </form>
                            </div>
                        </fieldset>
                         {!this.state.sendLoading ?

                            <div className="submit-button" onClick={this.handleSubmit} onMouseLeave={() => this.setState({hoveringSubmitButton:false})} onMouseEnter={() => this.setState({hoveringSubmitButton:true})}
                                                                                        style={{cursor: answerNode.data().validateSubmit(this.state.inputText) ? "pointer":"not-allowed",
                                                                                        backgroundColor: answerNode.data().validateSubmit(this.state.inputText)  && this.state.hoveringSubmitButton ? "rgba(255, 255, 255, 0.9)" : "",
                                                                                            color:answerNode.data().validateSubmit(this.state.inputText)  && this.state.hoveringSubmitButton ? "#022b56" : "white"}}>
                                {answerNode.data().validateSubmit(this.state.inputText) ? this.borderTagHighOpacity : this.borderTagLowOpacity}
                                <div className="button-text" style={{opacity: answerNode.data().validateSubmit(this.state.inputText) ? "1":"0.5"}}>הבא</div>
                            </div>

                         :
                         <Loader/>}

                    </div>: ""}
                {this.state.currentNode && this.state.currentNode.childNodes()[0] && this.state.currentNode.childNodes()[0].data().type === ANSWER_OPTION && this.state.showAnswers?
                    <div className="answer-options-wrapper" >
                        {!this.state.sendLoading ?
                        <div style={{display: "flex", flexDirection: "row"}}>
                            {/*{this.state.currentNode.childNodes()[0].data().content}*/}
                            {this.state.currentNode.childNodes().map((option, index) => {
                                return (option.data().content)}
                            )}

                        </div> :
                        <Loader/>}
                    </div> : ""}
                {this.state.currentNode && this.state.currentNode.data().completed && this.state.showAnswers?
                    <div>
                    <Confetti width={document.body.clientWidth} height={document.body.clientHeight} numberOfPieces={200} recycle={false} gravity={0.22}/>
                    <Confetti width={document.body.clientWidth} height={document.body.clientHeight} numberOfPieces={200} recycle={false} gravity={0.22}/>
                    </div>
                    : ""}
            </div>
        );
    }
}