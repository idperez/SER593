import React, { Component } from 'react';
import {
    AppRegistry
} from 'react-native';

import App from './app/components/App';

export default class topia extends Component {

    render() {
        return (
            <App/>
        );
    }
}

AppRegistry.registerComponent('topia', () => topia);
