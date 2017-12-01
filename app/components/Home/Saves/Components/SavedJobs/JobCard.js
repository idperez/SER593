import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    TouchableHighlight
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
    Icon,
    FooterTab,
    Grid,
    Col,
    H3
} from 'native-base';

import ActionSheet from 'react-native-actionsheet';

import Toast from 'react-native-root-toast';

import remove from './../../../../../../lib/jobs/save';

const CANCEL_INDEX = 0;
const UNSAVE_INDEX = 1;
const options = [ 'Cancel', 'Unsave' ];

export default class CityMatch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showJobOptions: true,
            arrowIconUp: true
        };

        this.handlePress = this.handlePress.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    removeJob() {
        remove.removeJob(this.props.jobkey).then(res => {
            let toast = Toast.show('Job Removed!', {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });

            setTimeout(function () {
                Toast.hide(toast);
            }, 1000);

            this.props.refreshJobs(this.props.index);
        }).catch(err => {
            throw err;
        });
    }

    handlePress(choice) {
        switch(choice) {
            case UNSAVE_INDEX:
                this.removeJob();
                break;
        }
    }

    sanitizeDaysOld(dayString) {
        return dayString.split(" ")[0].replace("+", "");
    }

    render() {
        return (
            <Card style={styles.card}>
                <CardItem>
                    <Body>
                        <Grid>
                            <Col size={90}>
                                <H3>{this.props.company}</H3>
                                <Text>{this.props.title}</Text>
                                <Text style={styles.cityText}>{this.props.city}, {this.props.state}</Text>
                            </Col>
                            <Col size={10}>
                                <View style={styles.container}>
                                    <TouchableHighlight onPress={this.showActionSheet} underlayColor="white">
                                        <Icon style={{color: '#9B59B6'}} name="ios-heart"/>
                                    </TouchableHighlight>
                                    <Text style={styles.dayText}>{this.sanitizeDaysOld(this.props.daysOld)}d</Text>
                                </View>
                            </Col>
                        </Grid>
                    </Body>
                </CardItem>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={UNSAVE_INDEX}
                    onPress={this.handlePress}
                />
            </Card>
        );
    }
}


const styles = StyleSheet.create({
    buttonText: {
        color: 'white'
    },
    aboutButton: {
        backgroundColor: '#AEA8D3'
    },
    exploreButton: {
        backgroundColor: '#8883a9'
    },
    viewButton: {
        backgroundColor: '#5d5b7e'

    },
    footer: {
        height: 30
    },
    card: {
        marginTop: 5,
        marginBottom: 5
    },
    cityText: {
        fontSize: 12
    },
    dayText: {
        fontSize: 12
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
