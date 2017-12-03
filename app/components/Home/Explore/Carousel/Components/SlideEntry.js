import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

import {
    Icon
} from 'native-base';

import styles from './../Styles/EntryStyles';

import company from './../../../../../../lib/jobs/company';

import { Actions } from 'react-native-router-flux';

import BusyIndicator from 'react-native-busy-indicator';

import loaderHandler from 'react-native-busy-indicator/LoaderHandler';

export default class SliderEntry extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showContent: true
        }
    }

    openJob(job) {
        this.setState({showContent: false});
        loaderHandler.showLoader("");
        company.getCompanyInfo(job.data.company).then(company => {
            this.setState({showContent: true});
            loaderHandler.hideLoader();
            if(!company.err) {
                Actions.jobProfile({
                    company: company,
                    job: job.data
                });
            }
        }).catch(err => {
            throw err;
        });
    }

    render () {
        const { data: { jobtitle, snippet, company}, even } = this.props;

        const uppercaseTitle = jobtitle ? (
                <Text
                    style={[styles.title, even ? styles.titleEven : {}]}
                    numberOfLines={2}
                >
                    { jobtitle.toUpperCase() }
                </Text>
            ) : false;

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() =>  this.openJob(this.props)}
            >
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    <Text>{company}</Text>
                    { uppercaseTitle }
                    <Text
                        style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                        numberOfLines={2}
                    >
                        { snippet }
                    </Text>
                    <BusyIndicator
                        overlayColor='transparent'
                        color="#674172"
                        textColor="#674172"
                        Size="large"
                        text=""
                    />
                </View>
            </TouchableOpacity>
        );
    }
}