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
    Text,
    Tab,
    Tabs,
    TabHeading,
    Icon
} from 'native-base';

export default class SavedHomes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jobs: <View/>
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content style={styles.content}>
                    <Icon name="home"/>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        marginTop: 100
    }
});
