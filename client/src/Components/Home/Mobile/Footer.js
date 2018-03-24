import React, {Component} from "react";
import {TITLES} from "../../Consts";
import './footer.css'
export default class MobileFooter extends Component {
    render() {
        return (
            <div className="mobile-footer">
                <div className="next-button" onClick={this.props.nextScreen}>
                    <div className="next-button-wrapper">
                    <div className="next-button-text">
                        התחל ייעוץ
                    </div>
                    <img className="arrow-next" src="/images/arrow_mobile.png"/>
                    </div>
                </div>
            </div>
        )
    }
}