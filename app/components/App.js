import React, { Component } from 'react';

import SplashContainer from './splash/SplashContainer';

import Register from './register/Register';

export default class App extends Component {

    render() {
        return (
            <SplashContainer>
                <Register/>
            </SplashContainer>
        );
    }
}
