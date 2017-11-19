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
    Text
} from 'native-base';

import Header from '../../Headers/Header';

export default class Saves extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header/>
                <Content>
                    <Text>Saves</Text>
                </Content>
            </Container>
        );
    }
}
