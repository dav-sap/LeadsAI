import React, {Component} from 'react'
import NextButton from "../NextButton/NextButton";
import {isChrome} from './../../Utils'

export default class AnswerCalendarMobile extends Component{
    state = {

        dateStr: ""
    }

    dateChosen = (e) => {
        if (e.target.value === "") {
            this.setState({dateStr: ""});
            return;
        } else {
            let copyDate = new Date(e.target.value);
            console.log(copyDate);
            let options = {year: 'numeric', month: 'numeric', day: 'numeric'};
            console.log(copyDate.toLocaleDateString('he-IL', options));
            this.setState({
                dateStr: copyDate.toLocaleDateString('he-IL', options),
            });
        }
    }
    openDate = () => {

        document.getElementById("date-picker").focus();
        document.getElementById("date-picker").click();
    }

    render() {
        return (

        <div className="answer-calendar-mobile">
            <div className="text-input-date" onClick={this.openDate}>
                <div className="user-input">
                    {this.state.dateStr === "" ? "הכנס תאריך" : this.state.dateStr}
                </div>
                <div className="arrow-open-date"/>
            </div>

            <input type="date" id="date-picker" onChange={this.dateChosen} />

            { this.state.dateStr !== "" ?
            <NextButton showing={this.props.showing} currentNode={this.props.currentNode} nextButton={true} content={"הבא"} error={this.props.error}
            answerNode={this.props.answerNode} createUser={this.props.createUser} addDataToDB={this.props.addDataToDB} /> : ""}
        </div>
    )

    }
}