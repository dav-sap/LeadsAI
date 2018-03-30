import React, { Component } from 'react';
import {WHEN_WED_QUESTION} from './GraphBot';
import Loader from "./Loader";

const dateStateStr = "בחר תאריך";

export default class AnswerCalendar extends Component {

    state = {
        sendLoading: false,
        currentDateShowing: new Date(),
        dateStr: dateStateStr,
        calendarVisible: false,
        hoveringSubmitButton: false,
        dayChosen: 0,
    };
    changeMonth = (increment) => {

        let copyDate = new Date(this.state.currentDateShowing);
        copyDate.setMonth(this.state.currentDateShowing.getMonth() + increment);
        this.setState({
            currentDateShowing: copyDate
        })
    }
    chooseDate = (day) => {
        let copyDate = new Date(this.state.currentDateShowing);
        copyDate.setDate(day);
        let options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        this.setState({
            dayChosen: day,
            dateStr:copyDate.toLocaleDateString('he-IL', options),
            calendarVisible: false
        })
    }
    handleSubmit = () => {
        //this.state.currentDateShowing.toLocaleDateString('en-EN', options).toUpperCase() + " " + i.toString()
        this.setState({sendLoading: true});
        this.props.addDataToDB(WHEN_WED_QUESTION, this.state.dateStr, this.props.currentNode.childNodes()[0].childNodes()[0]);
    };
    openDate = () => {
        this.setState({
            calendarVisible: !this.state.calendarVisible
        })
    }
    isValidAndHover() {
        return this.state.hoveringSubmitButton && !this.mobile && this.state.dateStr !== dateStateStr;
    }
    isValidInput() {
        return this.state.dateStr !== dateStateStr;
    }
    isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    }
    isChrome() {
        return !!window.chrome && !!window.chrome.webstore;
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
            days.push(<th className="day" onClick={() => this.chooseDate(i)} style={{backgroundColor: this.state.dayChosen === i ? "white" : ""}}>
                {i}</th>)
        }
        for (let i = 0; i < weeksToCreate; ++i) {
            weeks.push(<tr className="week">{days.slice((7) * i, (7) * i + 7)}</tr>)
        }
        return (

            <div className="calendar-wrapper">


                        <div className="text-input-date" onClick={this.openDate}>
                            <div className="user-input">
                                {this.state.dateStr}
                            </div>
                            <div className="arrow-open-date"/>

                        </div>


                        {this.state.calendarVisible ?
                        <div className="table-calendar" >
                            <div className="choose-month-wrapper">
                                <div className="arrow-clickable-area left-arrow-container" onClick={() => this.changeMonth(1)}>
                                <i className="calendar-arrow left"/>
                                </div>
                                <div className="choose-month">{this.state.currentDateShowing.toLocaleDateString('he-IL', options).toUpperCase()}</div>
                                <div className="arrow-clickable-area right-arrow-container" onClick={() => this.changeMonth(-1)}>
                                <i className="calendar-arrow right" />
                                </div>
                            </div>
                            <table>
                                <tbody className="calendar">{weeks}</tbody>
                            </table>
                        </div> :

                        this.isValidInput() ?
                        <div style={{position: "relative"}}>
                            <div className="submit-button" onClick={this.handleSubmit}
                                      onMouseLeave={() => this.setState({hoveringSubmitButton: false})}
                                      onMouseEnter={() => this.setState({hoveringSubmitButton: true})}
                                      style={{cursor: this.isValidAndHover() ? "pointer" : "not-allowed", visibility: this.state.sendLoading ? "hidden" :"visible"}}>
                                <svg className="svg-border" width="203" height="54" opacity={this.isValidInput() ? "1" : "0.5"}>
                                    <defs>
                                        <linearGradient id="borderGradient">
                                            <stop offset="0%"  stopColor="#02c0fd"/>
                                            <stop offset="30%" stopColor="#fecf03"/>
                                            <stop offset="100%" stopColor="#fd504f"/>
                                        </linearGradient>
                                    </defs>
                                    <rect className="border-rect-next" rx="18" ry="18" x="1" y="1" height="51.8" width="201" stroke="url(#borderGradient)" style={{fill: (this.isValidAndHover() ? "rgba(255, 255, 255, 0.9)" : "")}}/>
                                    <text  x="50%" y={this.isFirefox() ? "60%" : "50%"}  textAnchor="middle" alignmentBaseline="middle" fontFamily="Heebo" fontSize="18.8" fill={this.isValidAndHover() ? "#022b56" :"white"}>הבא</text>
                                </svg>
                            </div>
                            <div className="loader-wrapper" style={{visibility: !this.state.sendLoading ? "hidden" :"visible"}}>
                                <Loader/>
                            </div>
                        </div> : ""}


            </div>
        )
    }
}