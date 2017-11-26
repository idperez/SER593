import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View
} from 'react-native';

import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Left,
    Right,
    Title,
    FooterTab,
    Text
} from 'native-base';

import { Actions } from 'react-native-router-flux';

export default class Landing extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Image
                    source={require('./../../images/icons/landing/landing-wallpaper.jpg')}
                    style={styles.container}>
                    <Container>
                        <Content scrollEnabled={false}>
                            <Image source={require('../../images/logo/topia-splash.png')} style={styles.image} />
                        </Content>
                    </Container>
                </Image>
                <Footer style={styles.footer}>
                    <FooterTab>
                        <Button full style={styles.login} onPress={Actions.login}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </Button>
                        <Button full style={styles.register} onPress={Actions.register}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
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
    },
    buttonText: {
        color: 'white'
    },
    login: {
        backgroundColor: '#674172'
    },
    register: {
        backgroundColor: '#9B59B6'
    },
    footer: {
        borderTopWidth: 0
    }
});
