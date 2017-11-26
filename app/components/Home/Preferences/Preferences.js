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

import Header from '../../Headers/Header';

import PreferencesForm from './Components/Preferences/Preferences';

import CityMatch from './Components/CityMatch/CityMatch';

export default class Preferences extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header/>
                <Tabs>
                    <Tab heading={ <TabHeading><Icon name="ios-person-outline" /><Text>Preferences</Text></TabHeading>}>
                        <PreferencesForm/>
                    </Tab>
                    <Tab heading={ <TabHeading><Icon name="ios-stats" /><Text>Matches</Text></TabHeading>}>
                        <CityMatch/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
