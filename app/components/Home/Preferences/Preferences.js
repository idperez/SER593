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

import SuccessPreferencesDialogue from '../../dialogues/preferences/SuccessPreferencesDialogue';

import preferences from '../../../../lib/preferences/preferences';

export default class Preferences extends Component {

    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            cityMatch: {}
        }
    }

    savePreferences = (jobTitle, jobType, daysOld) => {
        preferences.setProfile(
            jobTitle,
            jobType,
            daysOld
        ).then((result) => {
            this.refs.preferencesSaved.successSavedPreferences();
            this.refs.match.reloadCityMatch();
        }).catch(err => {
            throw err;
        });
    };

    render() {
        return (
            <Container>
                <Header/>
                <Tabs>
                    <Tab heading={ <TabHeading><Icon name="ios-person-outline" /><Text>Preferences</Text></TabHeading>}>
                        <PreferencesForm
                            savePreferences={this.savePreferences}
                        />
                    </Tab>
                    <Tab heading={ <TabHeading><Icon name="ios-stats" /><Text>Matches</Text></TabHeading>}>
                        <CityMatch ref="match"/>
                    </Tab>
                </Tabs>
                <SuccessPreferencesDialogue ref="preferencesSaved"/>
            </Container>
        );
    }
}
