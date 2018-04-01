
import React, { Component } from 'react';
import ConsultantImg from "./ConsultantImg";
import {TITLES} from "../../../Consts";


export default class ConsultantsScreen extends Component {
    state = {
        consultants: [],
    }
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
        return (<div className="consultant-screen">

            <div className="mobile-title">
                <div className="angel-img-wrapper">
                    <img className="floating-head" src="/images/floating-thing.png"/>
                    <img className="angel" src="/images/angel.png"/>
                </div>
                <div className="mobile-top-title">
                    {TITLES.CLICK_TITLE}
                </div>
                <div className="mobile-sub-title">
                    {TITLES.FREE_OF_CHARGE}
                </div>
            </div>
            <div className="mobile-consultants-wrapper">
            {this.state.consultants.map((consultant, index) =>
                <ConsultantImg closeScreen={this.props.closeScreen} key={index} info={consultant} history={this.props.history}/>)}
            </div>

        </div>)
    }

}