import React, {Component} from "react";
import {TITLES} from "../../Consts";
import './title.css'
export default class MobileTitle extends Component {
    render() {
        return (
            <div className="mobile-title">
                <div className="mobile-top-title">
                    {TITLES.MOBILE_MAIN_TITLE}
                </div>
                <div className="mobile-sub-title">
                    {TITLES.MIDDLE}
                </div>
            </div>
        )
    }
}