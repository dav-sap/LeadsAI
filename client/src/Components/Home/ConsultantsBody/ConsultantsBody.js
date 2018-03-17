import React, { Component } from 'react';
import './consultants.css'
import ConsultantCard from "../ConsultantCard/ConsultantCard";
import {TITLES} from "../../Consts";

export default class ConsultantsBody extends Component {

    state = {
        consultants : [],
    };
    error = "";

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
                        console.log(resJson);
                        this.setState({consultants : resJson});
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
                <div className="consultant-title">{TITLES.CONSULTANT_TITLE}
                    <img src="images/arrow.png"
                         srcset="images/arrow@2x.png 2x,images/arrow@3x.png 3x"
                         className="arrow"/>
                </div>
                <div className="cards-wrapper">
                    {this.state.consultants.map((consultant, index) =>
                        <ConsultantCard key={index} info={consultant}/>)}
                </div>
            </div>
        );
    }
}