
import React, { Component } from 'react';
import './header.css'

export default class MobileHeader extends Component {
    render() {
        return (
            <div className={this.props.chat ? "mobile-header-chat": "mobile-header-basic"}>
                <div className="status-wrapper">
                    <div className="dot-wrapper">
                        <div className="status-glow"/>
                        <div className="status-dot"/>
                    </div>
                    <div className="status">
                        Connected
                    </div>
                </div>
            </div>
        )

    }
}