import React, { Component } from 'react';
import {
    AsyncStorage,
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
    Text
} from 'native-base';

import Header from '../../Headers/Header';

import SuccessRegisterDialogue from '../../dialogues/register/SuccessRegisterDialogue';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: ""
        };

        this.getToken();
    }

    componentDidMount() {
        if(this.props.firstTime) {
            this.refs.firstTime.showSuccessfulRegistrationDialog();
        }
    }

    getToken() {
        AsyncStorage.getItem('token')
            .then((token) => {
                this.setState({token})
        });
    }

    render() {
        return (
            <Container>
                <Header/>
                <Content>
                    <Text>{this.state.token}</Text>
                </Content>
                <SuccessRegisterDialogue ref="firstTime"/>
            </Container>
        );
    }
}
