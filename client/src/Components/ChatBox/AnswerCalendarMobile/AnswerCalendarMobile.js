import React, {Component} from 'react'
import NextButton from "../NextButton/NextButton";
import {isChrome, isFirefox} from './../../Utils'

export default class AnswerCalendarMobile extends Component{
    state = {

        dateStr: ""
    }

    dateChosen = (e) => {
        if (e.target.value === "") {
            this.setState({dateStr: ""});
        } else {
            let copyDate = new Date(e.target.value);
            console.log(copyDate);
            let options = {year: 'numeric', month: 'numeric', day: 'numeric'};
            console.log(copyDate.toLocaleDateString('he-IL', options));
            this.setState({
                dateStr: copyDate.toLocaleDateString('he-IL', options),
            });
        }
        if (isFirefox()) {
            document.getElementById("date-picker").blur();
        }

    }
    onClose = () => {
        if (isFirefox()) {
            document.getElementById("date-picker").blur();
        }
    }
    openDate = () => {
        document.getElementById("date-picker").focus();
        // document.getElementById("date-picker").click();
    }

//<div className="arrow-open-date"/>
// </button>
// <input type="date" id="date-picker" onChange={this.dateChosen} onSelect={this.onClose} 
//             value={this.state.dateStr === "" ? "הכנס תאריך" : this.state.dateStr}  />
    render() {
        return (

        <div className="answer-calendar-mobile">
            
            <div className="user-input">
                {this.state.dateStr === "" ? "בחר תאריך" : this.state.dateStr}
                <div className="arrow-open-date-mobile-picker"/>
            </div>            
            <input type="date" id="date-picker" onChange={this.dateChosen} onSelect={this.onClose}/>
            

            { this.state.dateStr !== "" ?
            <NextButton currentNode={this.props.currentNode} nextButton={true} content={"הבא"} error={this.props.error}
                        answerNode={this.props.answerNode} createUser={this.props.createUser} addDataToDB={this.props.addDataToDB} /> : ""}
        </div>
    )

    }
}