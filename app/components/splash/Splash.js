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
            <Image
                source={require('./../../images/icons/landing/landing-wallpaper.jpg')}
                style={styles.container}>
                <Container>
                    <Content scrollEnabled={false}>
                        <Image source={require('../../images/logo/topia-splash.png')} style={styles.image} />
                    </Content>
                </Container>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: undefined,
        height: undefined,
        backgroundColor:'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        marginTop: 25
    }
});
