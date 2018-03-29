import React, { Component } from 'react';
import {WHEN_WED_QUESTION} from './GraphBot';
import Loader from "./Loader";


export default class AnswerCalendar extends Component {

    state = {
        sendLoading: false,
        currentDateShowing: new Date()
    };
    changeMonth = (increment) => {

        let copyDate = new Date(this.state.currentDateShowing);
        copyDate.setMonth(this.state.currentDateShowing.getMonth() + increment);
        this.setState({
            currentDateShowing: copyDate
        })
    }
    render() {
        let options = {month: 'short', year: 'numeric'};
        let copyDate = new Date(this.state.currentDateShowing);
        let lastDayDate = new Date(copyDate.getFullYear(), copyDate.getMonth() + 1, 0);
        let lastDay = lastDayDate.getDate();
        let weeksToCreate = lastDay > 28 ? 5 : 4;
        let weeks = [];
        let days = [];
        for (let i = 1; i <= lastDay; ++i) {
            days.push(<th className="day" onClick={() => {this.setState({sendLoading: true});this.props.addDataToDB(WHEN_WED_QUESTION, this.state.currentDateShowing.toLocaleDateString('en-EN', options).toUpperCase() + " " + i.toString(), this.props.currentNode.childNodes()[0].childNodes()[0])}}>
                {i}</th>)
        }
        for (let i = 0; i < weeksToCreate; ++i) {
            weeks.push(<tr className="week">{days.slice((7) * i, (7) * i + 7)}</tr>)
        }
        return (
            <div className="calendar-wrapper">

                    <div style={{visibility: this.state.sendLoading ? "hidden" :"visible"}}>
                        <div className="choose-month-wrapper">
                            <th className="calendar-arrow left" onClick={() => this.changeMonth(-1)}/>
                            <th className="choose-month">{this.state.currentDateShowing.toLocaleDateString('en-EN', options).toUpperCase()}</th>
                            <th className="calendar-arrow right" onClick={() => this.changeMonth(1)}/>
                        </div>
                        <table>
                        <tbody className="calendar">{weeks}</tbody>
                        </table>
                    </div>
                    <div className="loader-wrapper" style={{visibility: !this.state.sendLoading ? "hidden" :"visible"}}>
                        <Loader/>
                    </div>
            </div>
        )
    }
}