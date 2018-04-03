import React, { Component } from 'react';
import "./chat-box.css"
import "./send-loader.css"
import "./loading-dots.css"
// import TypeWriter from 'react-typewriter';
import Confetti from 'react-confetti'
// import BOT_LOGIC from './GraphBot';
import {ERROR} from "../Consts";
import {ANSWER_OPTION, ANSWER_INPUT, WEB_BOT, MOBILE_BOT, ANSWER_CALENDAR, ANSWER_PIC_OPTIONS} from './GraphBot';
import MobileHeader from "../Home/Mobile/MobileHeader";
import Typist from 'react-typist';
import AnswerInput from "./AnswerInput/AnswerInput";
import AnswerOptions from "./AnswerOptions/AnswerOptions";
import AnswerCalendar from "./AnswerCalendar/AnswerCalendar";
import AnswerPicOptions from "./AnswerPicOptions";

import Confetti2 from 'react-dom-confetti';
import AnswerCalendarMobile from "./AnswerCalendarMobile/AnswerCalendarMobile";
import {isMobile} from "../Utils";

const config = {
    angle: 90,
    spread: 60,
    startVelocity: 20,
    elementCount: 30,
    decay: 0.95
};
export default class ChatBox extends Component {

    state = {
        currentNode: null,
        error: false,
        showAnswers: false,
        nodeIndex: 0,
        hoveringSubmitButton: false,
        shootConfetti: false,

    };

    dbUser = null;
    bot = null;
    chatStartDate = null;
    isDate = null;

    mobile = false;

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
                        showAnswers: false,
                        currentNode: this.state.currentNode.childNodes()[0].childNodes()[0],
                        nodeIndex: this.state.nodeIndex + 1,
                    }), 2000);
                }
            } else {
                this.setState({error: true});
                console.error("Server Error");
            }
        } catch (error) {
            this.setState({error: true});
            console.error(error);
        }
    };
    changeShootConfetti = ()=> {
        if (!this.state.shootConfetti) {
            window.navigator.vibrate(60);
            this.setState({
                    shootConfetti: true
                }, () => {
                    setTimeout(() => this.setState({shootConfetti: false}), 1500)
                }
            )
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
                    if (newNode.data().completed) {
                        setTimeout(() => {this.setState({showAnswers: false, currentNode: newNode,  nodeIndex: this.state.nodeIndex + 1});
                            setTimeout(() => {console.log("COMPLETED!");this.changeShootConfetti()}, 3500);}, 2000);
                    }
                    setTimeout(() => this.setState({showAnswers: false, currentNode: newNode,  nodeIndex: this.state.nodeIndex + 1,}), 2000);
                }
            } else {
                this.setState({error: true});
                console.error(res);
            }
        } catch(error) {
            this.setState({error: true});
            console.error(error);
        }
    };



    chooseConsultant = (name)=> {
        this.consultantChosen = name;
        setTimeout(() => this.setState({showAnswers: false, currentNode: this.state.currentNode.childNodes()[0].childNodes()[0], nodeIndex: this.state.nodeIndex + 1,}), 2000);
    };

    componentWillMount(){
        if (!this.props.location.state || (isMobile() && !this.props.location.state.consultants)) {
            this.props.history.push({pathname:'/'})
            this.setState({
                redirect: true
            })
            return;
        }
        if (isMobile()) {
            this.bot = MOBILE_BOT;
            this.mobile = true;
        } else {
            this.consultantChosen = this.props.location.state.name;
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
            nextState.currentNode.data().consultantName = this.consultantChosen === "טלי" ?  "טלי תיצור" : this.consultantChosen + " יצור";
        }
    }
    onFinishType = () => {
        this.setState({showAnswers:true});
    };
    getAnswerStyle(answerNode) {
        if (this.state.showAnswers) {
            if ( answerNode && answerNode.data().type === ANSWER_CALENDAR) {
                return {
                    visibility:"visible",
                    opacity:"1",
                    top:"0",
                    paddingBottom: "0"

                }
            }
            return {
                visibility:"visible",
                opacity:"1",
                top:"0",

            }
        } else {
            return {
                visibility:"hidden",
                opacity:"0",
                top:"10px",
                transitionProperty: "none",
            }
        }
    }

    render() {
        let answerNode = this.state.currentNode && this.state.currentNode.childNodes()[0] ? this.state.currentNode.childNodes()[0] : null;
        if (this.state.redirect) {
            return <div></div>
        }
        return (
            <div className="chat-box-wrapper" style={{overflowY: this.state.currentNode.data().completed ? "hidden" : "auto"}}>
                <div className="chat-box">
                    {this.mobile ? <MobileHeader/> : ""}
                    <div className="text-wrapper"  style={{direction: this.state.currentNode.data().dir ? this.state.currentNode.data().dir : "rtl"}}>
                        <Typist key={this.state.nodeIndex} avgTypingDelay={35} stdTypingDelay={0} className="text-typer" startDelay={1500} onTypingDone={this.onFinishType} >
                            {this.state.currentNode.data().content}
                        </Typist>

                    </div>
                    <div className="answer-wrapper" style={this.getAnswerStyle(answerNode)}>
                        {this.state.error ? <div className="error-msg">{ERROR}</div> : ""}
                        {answerNode && answerNode.data().type === ANSWER_PIC_OPTIONS && this.state.showAnswers?
                            <AnswerPicOptions answerNode={answerNode} data={ this.props.location.state.consultants}
                                              history={this.props.history} currentNode={this.state.currentNode} chooseConsultant={this.chooseConsultant} error={this.state.error}/> : ""}
                        {answerNode && answerNode.data().type === ANSWER_INPUT  && this.state.showAnswers?
                            <AnswerInput answerNode={answerNode} currentNode={this.state.currentNode} error={this.state.error}
                                         addDataToDB={this.addDataToDB} createUser={this.createUser} /> : ""}
                        {answerNode && answerNode.data().type === ANSWER_CALENDAR && this.state.showAnswers?
                            !this.mobile ?
                            <AnswerCalendar answerNode={answerNode} addDataToDB={this.addDataToDB} currentNode={this.state.currentNode} error={this.state.error}/> :
                            <AnswerCalendarMobile answerNode={answerNode} addDataToDB={this.addDataToDB} currentNode={this.state.currentNode} error={this.state.error}/> : ""}
                        {answerNode && answerNode.data().type === ANSWER_OPTION && this.state.showAnswers?
                           <AnswerOptions answerNode={answerNode} bot={this.bot} addDataToDB={this.addDataToDB} error={this.state.error} currentNode={this.state.currentNode} /> : ""}

                           {this.state.currentNode && this.state.currentNode.data().completed && this.state.showAnswers?
                            <div className="end-image-wrapper no-select" onClick={this.changeShootConfetti}>
                                <div className="glow-image-end"/>
                                <img className="end-img" alt="" src="/images/hands.png" />
                                <div style={{position: "absolute", top: "50%", left: "50%"}}>
                                <Confetti2 active={ this.state.shootConfetti } config={ config } />
                                </div>
                            </div>: ""}

                    </div>
                </div>
            </div>
        );
    }
}