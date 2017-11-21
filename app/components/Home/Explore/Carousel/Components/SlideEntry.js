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

export default class SliderEntry extends Component {

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
                onPress={() => { alert(`You've clicked '${jobtitle}'`); }}
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