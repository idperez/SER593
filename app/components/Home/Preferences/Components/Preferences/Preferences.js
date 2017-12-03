import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';

import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    FooterTab,
    Text,
    Form,
    Input,
    Item,
    Label,
    Grid,
    Col,
    Row,
    Thumbnail
} from 'native-base';

import { Dropdown } from 'react-native-material-dropdown';

import Header from '../../../../Headers/Header';

import SuccessPreferencesDialogue from '../../../../dialogues/preferences/SuccessPreferencesDialogue';

import preferences from '../../../../../../lib/preferences/preferences';

const jobTypes = [
    {
        value: 'Full Time'
    },
    {
        value: 'Part Time'
    },
    {
        value: 'Internship'
    }
];

const datePosted = [
    {
        value: 'Last Day'
    },
    {
        value: 'Last Week'
    },
    {
        value: 'Last Two Weeks'
    },
    {
        value: 'Last Month'
    },
    {
        value: 'Any Time'
    }
];

export default class PreferencesForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jobTitle: "",
            jobType: "",
            datePosted: ""
        };
    }

    setJobTitle(jobTitle) {
        this.setState({jobTitle})
    }

    setJobType(jobType) {
        this.setState({jobType})
    }

    setDatePosted(datePosted) {
        this.setState({datePosted})
    }

    getDaysOld(type) {
        let days = 0;

        switch(type) {
            case "Last Day":
                days = 1;
                break;
            case "Last Week":
                days = 7;
                break;
            case "Last Two Weeks":
                days = 14;
                break;
            case "Last Month":
                days = 31;
                break;
            default:
                days = 31;
                break;
        }
        return days;
    }

    savePreferences() {
        if(this.state.jobTitle.length > 1) {
            const daysOld = this.getDaysOld(this.state.datePosted);
            preferences.setProfile(
                this.state.jobTitle,
                this.state.jobType,
                daysOld
            ).then((result) => {
                alert(JSON.stringify(result));
                this.refs.preferencesSaved.successSavedPreferences();
            }).catch(err => {
                throw err;
            });
        }
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <Body>
                                    <Thumbnail source={require('./../../../../../images/icons/preferences/header.png')} />
                                    <Text>Edit Preferences</Text>
                                </Body>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <Body style={styles.jobHeader}>
                            <Thumbnail source={require('./../../../../../images/icons/preferences/jobs.png')} />
                        </Body>
                        <Form>
                            <Item floatingLabel style={styles.dropDowns}>
                                <Label>Job Title</Label>
                                <Input
                                    onChangeText={(title) => this.setJobTitle(title)}
                                />
                            </Item>
                            <View style={styles.dropDowns}>
                                <Dropdown
                                    label='Job Type'
                                    data={jobTypes}
                                    onChangeText={(jobType) => this.setJobType(jobType)}
                                />
                            </View>
                            <View style={styles.dropDowns}>
                                <Dropdown
                                    label='Date Posted'
                                    onChangeText={(datePosted) => this.setDatePosted(datePosted)}
                                    data={datePosted}
                                />
                            </View>
                        </Form>
                    </Card>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full style={styles.savePreferences} onPress={() => this.savePreferences()}>
                            <Text style={styles.buttonText}>Save Preferences</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                <SuccessPreferencesDialogue ref="preferencesSaved"/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#9B59B6'
    },
    HeaderImage: {
        marginBottom: 10
    },
    buttonText: {
        color: 'white'
    },
    facebookButton: {
        backgroundColor: '#3b5998',
        marginTop: 4,
        marginRight: 2
    },
    linkedInButton: {
        backgroundColor: '#0077B5',
        marginTop: 4,
        marginLeft: 2
    },
    loginButton: {
        backgroundColor: '#AEA8D3'
    },
    savePreferences: {
        backgroundColor: '#674172'
    },
    dropDowns: {
        marginLeft: 10,
        marginRight: 10
    },
    jobTitle: {
        marginLeft: 10
    },
    jobHeader: {
        marginBottom: -20,
        marginTop: 10
    }
});
