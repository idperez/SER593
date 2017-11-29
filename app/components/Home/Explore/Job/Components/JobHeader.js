import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';

import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Button,
    Icon,
    Title,
    Text,
    Right
} from 'native-base';

import { Actions } from 'react-native-router-flux';

export default class JobHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Header style={styles.header}>
                <Left>
                    <Button transparent onPress={() => {Actions.pop()}}>
                        <Icon name='arrow-back' style={styles.backIcon} />
                    </Button>
                </Left>
                <Body>
                    <Title style={styles.headerText}>{this.props.title}</Title>
                </Body>
                <Right/>
            </Header>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#9B59B6'
    },
    headerText: {
        color: 'white'
    },
    backIcon: {
        color: 'white'
    }
});
