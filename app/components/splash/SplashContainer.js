import React, { Component } from 'react';

import SplashConfig from './SplashConfig';

import Splash from './Splash';

const timeout = SplashConfig.timeout;

export default class SplashContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            done: false
        };
    }

    componentDidMount() {
        this.timer();
    }

    timer() {
        setTimeout(() => {
            this.setState({
                done: true
            });
        }, timeout);
    }

    render() {
        if (!this.state.done) {
            this.timer();
        }
        return (
            this.state.done ?
                // if done, show all props nested
                ({ ...this.props.children })
                :
                // else show splash
                (<Splash />)
        );
    }
}
