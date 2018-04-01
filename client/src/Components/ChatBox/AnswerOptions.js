import React, { Component } from 'react';
import Loader from "./Loader";
import NextButton from "./NextButton/NextButton";


export default class AnswerOptions extends Component {
    state = {
        sendLoading: false,
    };
    answerClicked = (answer) => {
        console.log("here");
        this.setState({sendLoading: true});
        let nextNode = this.props.bot.traverser().searchBFS(function(data){
            return data.content === answer;
        });
        this.props.addDataToDB(this.props.currentNode.data().content, answer, nextNode.childNodes()[0]);
    };
    isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    }
    isChrome() {
        return !!window.chrome && !!window.chrome.webstore;
    }
    render() {
        return (
            <div className="answer-options-wrapper">
                <div style={{display: "flex", flexDirection: "row", visibility: this.state.sendLoading ? "hidden" :"visible"}}>
                    {this.props.currentNode.childNodes().map((node, index) => {
                        return <NextButton showing={this.props.showing} currentNode={this.props.currentNode}  nextButton={false} content={node.data().content}
                                           answerNode={this.props.answerNode} createUser={this.props.createUser} addDataToDB={this.props.addDataToDB}/>
                        //( <div className="answer-option" onClick={() => this.answerClicked(node.data().content)} key={index}
                        //     >
                        //     <svg className="svg-border" width="125" height="54">
                        //         <defs>
                        //             <linearGradient id="borderGradient">
                        //                 <stop offset="0%"  stopColor="#02c0fd"/>
                        //                 <stop offset="30%" stopColor="#fecf03"/>
                        //                 <stop offset="100%" stopColor="#fd504f"/>
                        //             </linearGradient>
                        //         </defs>
                        //         <g>
                        //         <rect className="border-rect-option" height="51.8" x="1" y="1" width="123" rx="18" ry="18" />
                        //         <text className="text-tag-rect" x="50%" y={this.isFirefox() ? "60%" : "50%"} direction="rtl" textAnchor="middle" alignmentBaseline="middle" fontFamily="Heebo" fontSize="18.8">
                        //             </text>
                        //
                        //         </g>
                        //
                        //     </svg>
                        //
                        // </div>)
                    })
                    }

                </div>
                <div className="loader-wrapper" style={{visibility: !this.state.sendLoading ? "hidden" :"visible"}}>
                    <Loader/>
                </div>
        </div>)
    }
}