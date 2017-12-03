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

import SavedJobs from './Components/SavedJobs/SavedJobs';

import SavedHomes from './Components/SavedHomes/SavedHomes';

import SavedActivities from './Components/SavedActivities/SavedActivities';

export default class Saves extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header/>
                <Tabs>
                    <Tab heading={ <TabHeading><Icon name="ios-home-outline" /><Text>Home</Text></TabHeading>}>
                        <SavedHomes/>
                    </Tab>
                    <Tab heading={ <TabHeading><Icon name="ios-briefcase-outline" /><Text>Jobs</Text></TabHeading>}>
                        <SavedJobs/>
                    </Tab>
                    <Tab heading={ <TabHeading><Icon name="ios-sunny-outline" /><Text>Activities</Text></TabHeading>}>
                        <SavedActivities/>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
