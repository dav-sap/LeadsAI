import React, { Component } from 'react';
import Loader from "./Loader";


export default class AnswerOptions extends Component {
    state = {
        sendLoading: false,
        hoveringButton: [false, false]
    };
    answerClicked = (answer) => {
        this.setState({sendLoading: true});
        let nextNode = this.props.bot.traverser().searchBFS(function(data){
            return data.content === answer;
        });
        this.props.addDataToDB(this.props.currentNode.data().content, answer, nextNode.childNodes()[0]);
    };
    render() {
        return (
            <div className="answer-options-wrapper">
            {!this.state.sendLoading ?
                <div style={{display: "flex", flexDirection: "row"}}>
                    {this.props.currentNode.childNodes().map((node, index) => {
                        return (
                        <div className="answer-options" onClick={() => this.answerClicked(node.data().content)}
                             onMouseLeave={() => {let cpArr = this.state.hoveringButton.slice(0);cpArr.splice(index, 1, false); this.setState({hoveringButton:cpArr })}}
                             onMouseEnter={() => {let cpArr = this.state.hoveringButton.slice(0);cpArr.splice(index, 1, true ); this.setState({hoveringButton:cpArr})}}>
                            <svg className="svg-border" width="123" height="52">
                                <defs>
                                    <linearGradient id="borderGradient">
                                        <stop offset="0%"  stopColor="#02c0fd"/>
                                        <stop offset="30%" stopColor="#fecf03"/>
                                        <stop offset="100%" stopColor="#fd504f"/>
                                    </linearGradient>
                                </defs>
                                <rect className="border-rect-option" rx="18" ry="18" style={{fill: (this.state.hoveringButton[index] ? "rgba(255, 255, 255, 0.9)" : "")}}/>
                                <text x="50%" y="50%" direction="rtl" textAnchor="middle" alignmentBaseline="middle" fontFamily="Heebo" fontSize="18.8" fill={this.state.hoveringButton[index] ? "#022b56" :"white"}>{node.data().content}</text>
                            </svg>

                        </div>)
                    })
                    }

                </div> :
                <Loader/>}
        </div>)
    }
}