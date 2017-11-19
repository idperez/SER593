import React, { Component } from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

import {
    Header
} from 'native-base';

export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header style={styles.header}>
                <Image source={require('./../../images/logo/topia-sm.png')} style={styles.headerImage} />
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#9B59B6'
    },
    headerImage: {
        marginTop: -5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    }
});
