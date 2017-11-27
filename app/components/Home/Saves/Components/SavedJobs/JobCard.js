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

    handlePress(choice) {
        switch(choice) {
            case UNSAVE_INDEX:
                alert("unsave");
                break;
        }
    }

    render() {
        return (
            <Card style={styles.card}>
                <CardItem>
                    <Body>
                        <Grid>
                            <Col size={90}>
                                <H3>Intel</H3>
                                <Text>Software Engineer 3</Text>
                                <Text style={styles.cityText}>Phoenix, Arizona</Text>
                            </Col>
                            <Col size={10}>
                                <View style={styles.container}>
                                    <TouchableHighlight onPress={this.showActionSheet} underlayColor="white">
                                        <Icon style={{color: '#9B59B6'}} name="ios-heart"/>
                                    </TouchableHighlight>
                                    <Text style={styles.dayText}>13d</Text>
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
