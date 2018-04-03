import React, {Component} from "react";
import {TITLES} from "../../Consts";
import './footer.css'
export default class MobileFooter extends Component {

    render() {
        return (
            <div className="mobile-footer">
                <button className="next-button" onClick={() => this.props.closeScreen(true)}>
                    <div className="next-button-wrapper">
                    <div className="next-button-text">
                        התחל ייעוץ בחינם
                    </div>
                    <img className="arrow-next" src="/images/arrow_mobile.png"/>
                    </div>
                </button>
            </div>
        )
    }
}