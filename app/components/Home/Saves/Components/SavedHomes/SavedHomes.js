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
            <Container>
                <Content>
                    <Text>Home</Text>
                </Content>
            </Container>
        );
    }
}
