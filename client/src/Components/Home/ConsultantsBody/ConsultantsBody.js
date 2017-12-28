import React, { Component } from 'react';
import './consultants.css'
import ConsultantCard from "../ConsultantCard/ConsultantCard";

export default class ConsultantsBody extends Component {

    state = {
        //{consultant: {}, opacity: 0}
        consultants : [],
    };
    error = "";
    switchConsultant = (side, index) => {
        let dupConsultants = this.state.consultants;
        dupConsultants[index].opacity = 0;
        let newIndex = 0;
        if (side === "right") {
            if (index + 1 === this.state.consultants.length) {
                newIndex = 0;
            } else {
                newIndex = index + 1;
            }

        } else if (side === "left") {
            if (index - 1 === -1) {
                newIndex = this.state.consultants.length - 1;
            } else {
                newIndex = index - 1;
            }

        }
        dupConsultants[newIndex].opacity = 1;
        this.setState({
            consultants: dupConsultants
        })
    };
    fetchConsultants() {
        fetch("/consultants/get_consultants")
            .then(
                (response) => {
                    if (response.status !== 200) {
                        console.log(` Status Code: ${response.status}
                                    Error Getting consultant. Error: ${(response.error ? response.error : "")}`);
                        this.error = "Error Retrieving Data";
                        return;
                    }
                    response.json().then(resJson => {
                        this.error = resJson.length > 0 ? "" : "No Results";
                        this.setState({consultants : resJson.map((consultant, index) => {
                            if (index === 0) {
                                this.index = 0;
                                return {consultant: consultant, opacity: 1}
                            } else return {consultant: consultant, opacity: 0}
                        })});
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    }
    componentWillMount() {
        this.fetchConsultants();
    }
    render() {
        return (

            <div className="consultants">
                {this.state.consultants.map((consultantProp, index) =>
                    <ConsultantCard index={index} key={index} switchConsultant={this.switchConsultant} info={consultantProp.consultant} opacity={consultantProp.opacity}/>)}

            </div>
        );
    }
}