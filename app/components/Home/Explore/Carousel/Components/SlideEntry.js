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

import { Actions } from 'react-native-router-flux';

export default class SliderEntry extends Component {

    onPress(data) {
        Actions.jobProfile({jobData: data});
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
                onPress={() =>  this.onPress(this.props)}
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
                </View>
            </TouchableOpacity>
        );
    }
}