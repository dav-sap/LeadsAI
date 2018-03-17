import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import React, {Component} from "react";
import ChatBox from "./Components/ChatBox/ChatBox";
import Home from "./Components/Home/Home";

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route  exact path="/" component={Home}/>
                    <Route  path="/chat" component={ChatBox}/>
                    <Redirect from='*' to='/' />
                </Switch>
            </BrowserRouter>
        );
    }
}