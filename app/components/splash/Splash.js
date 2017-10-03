import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';

import { Container, Header, Content, Badge, Text, Icon } from 'native-base';

export default class Splash extends Component {

    render() {
        return (
            <Container style={styles.container} >
                <Content>
                    <Image source={require('../../images/logo/topia-splash.png')} style={styles.image} />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9B59B6'
    },
    image: {
        marginTop: 150
    }
});
