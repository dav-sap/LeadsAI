import React, { Component } from 'react';
import "./chat-box.css"
import "./send-loader.css"
import "./loading-dots.css"
// import TypeWriter from 'react-typewriter';
import Confetti from 'react-confetti'
// import BOT_LOGIC from './GraphBot';

import {ANSWER_OPTION, ANSWER_INPUT, WEB_BOT, MOBILE_BOT, ANSWER_CALENDAR, ANSWER_PIC_OPTIONS} from './GraphBot';
import MobileHeader from "../Home/Mobile/MobileHeader";
import Typist from 'react-typist';
import AnswerInput from "./AnswerInput";
import AnswerOptions from "./AnswerOptions";
import AnswerCalendar from "./AnswerCalendar";
import AnswerPicOptions from "./AnswerPicOptions";

import Confetti2 from 'react-dom-confetti';

const config = {
    angle: 90,
    spread: 60,
    startVelocity: 20,
    elementCount: 40,
    decay: 0.95
};
export default class ChatBox extends Component {

    state = {
        currentNode: null,

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
                    this.disableInput = false;
                }
            }
        } catch (error) {
            this.setState({showAnswers: false});
            this.disableInput = false;
            console.error(error);
        }
    };
    changeShootConfetti = ()=> {
        this.setState({
            shootConfetti: true
        }, () => this.setState({
            shootConfetti: false
        }))
    }
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

                    setTimeout(() => this.setState({showAnswers: false, currentNode: newNode,  nodeIndex: this.state.nodeIndex + 1,}), 2000);
                    this.disableInput = false;
                }
            } else {
                this.setState({showAnswers: false});
                this.disableInput = false;
                console.error(res);
            }
        } catch(error) {
            this.setState({showAnswers: false});
            this.disableInput = false;
            console.error(error);
        }
    };



    chooseConsultant = (name)=> {
        this.consultantChosen = name;
        setTimeout(() => this.setState({showAnswers: false, currentNode: this.state.currentNode.childNodes()[0].childNodes()[0], nodeIndex: this.state.nodeIndex + 1,}), 2000);
    };

    componentWillMount(){
        if (!this.props.location.state) {
            this.props.history.push({pathname:'/'})
            return;
        }
        if (this.props.location.state && this.props.location.state.mobile) {
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
        if (!this.props.location.state) {
            return <div></div>
        }
        return (
            <div className="chat-box-wrapper">
                <div className="chat-box">
                    {this.mobile ? <MobileHeader/> : ""}
                    <div className="text-wrapper"  style={{direction: this.state.currentNode.data().dir ? this.state.currentNode.data().dir : "rtl"}}>
                        <Typist key={this.state.nodeIndex} avgTypingDelay={35} stdTypingDelay={0} className="text-typer" startDelay={1500} onTypingDone={this.onFinishType} >
                            <div>{this.state.currentNode.data().content}</div>
                        </Typist>

                    </div>
                    <div className="answer-wrapper" style={this.getAnswerStyle(answerNode)}>
                        {answerNode && answerNode.data().type === ANSWER_PIC_OPTIONS?
                            <AnswerPicOptions showing={this.state.showAnswers}  answerNode={answerNode} data={ this.props.location.state.consultants} history={this.props.history} currentNode={this.state.currentNode} chooseConsultant={this.chooseConsultant}/> : ""}
                        {answerNode && answerNode.data().type === ANSWER_INPUT ?
                            <AnswerInput showing={this.state.showAnswers} answerNode={answerNode} currentNode={this.state.currentNode} addDataToDB={this.addDataToDB} createUser={this.createUser}/> : ""}
                        {answerNode && answerNode.data().type === ANSWER_CALENDAR?
                            <AnswerCalendar showing={this.state.showAnswers}  addDataToDB={this.addDataToDB} currentNode={this.state.currentNode} /> : ""}
                        {answerNode && answerNode.data().type === ANSWER_OPTION?
                           <AnswerOptions showing={this.state.showAnswers}  bot={this.bot} addDataToDB={this.addDataToDB} currentNode={this.state.currentNode} /> : ""}
                        {this.state.currentNode && this.state.currentNode.data().completed && this.state.showAnswers?
                            <div className="end-image-wrapper" onClick={this.changeShootConfetti}>
                                <div className="glow-image-end"/>
                                <img className="end-img" alt="" src="/images/hands.png" />
                                <div style={{position: "absolute", top: "50%", left: "50%"}}>
                                <Confetti2 active={ this.state.shootConfetti } config={ config } />
                                </div>
                            </div>: ""}

                    </div>
                    {this.state.currentNode && this.state.currentNode.data().completed && this.state.showAnswers?
                    <div>
                        <Confetti width={document.body.clientWidth - 3} height={document.body.clientHeight -3} numberOfPieces={250} recycle={false} gravity={0.18}/>
                        <Confetti width={document.body.clientWidth - 3} height={document.body.clientHeight -3} numberOfPieces={250} recycle={false} gravity={0.18}/>

                    </div>
                    : ""}
                </div>
            </div>
        );
    }
}