import React, { Component } from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Text
} from 'native-base';

import { Actions } from 'react-native-router-flux';

export default class Landing extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jobs: {}
        };
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card style={styles.card}>
                        <CardItem>
                            <Body>
                                <Body>
                                    <Text>Welcome to Topia!</Text>
                                    <Text note>endless exploration</Text>
                                </Body>
                            </Body>
                        </CardItem>
                        <CardItem cardBody>
                            <Image source={require('./../../images/icons/landing/hero.png')} style={{height: 200, width: null, flex: 1}}/>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Button full style={styles.explore} onPress={Actions.explore}>
                                    <Text style={styles.buttonText}>Explore</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <Footer>
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
    header: {
        backgroundColor: '#9B59B6'
    },
    image: {
        marginBottom: 10
    },
    card: {
        marginHorizontal: 10
    },
    buttonText: {
        color: 'white'
    },
    explore: {
        backgroundColor: '#AEA8D3'
    },
    login: {
        backgroundColor: '#9B59B6'
    },
    register: {
        backgroundColor: '#674172'
    }
});
