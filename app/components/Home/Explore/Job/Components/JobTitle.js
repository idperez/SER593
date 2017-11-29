import React, { Component } from 'react';
import {
    AsyncStorage,
    Image,
    StyleSheet,
    View,
    TouchableHighlight,
    Linking
} from 'react-native';

import {
    Container,
    Content,
    Left,
    Body,
    Button,
    Icon,
    Title,
    Text,
    Right,
    Card,
    CardItem,
    Thumbnail,
    Grid,
    Col,
    Footer,
    FooterTab
} from 'native-base';

export default class JobTitle extends Component {

    constructor(props) {
        super(props);

        this.state = {
            jobSaved: false
        };
    }

    saveJob() {
        if(!this.state.jobSaved) {
            this.setState({jobSaved: true});
        }
    }

    render() {
        return (
            <Content>
            <CardItem>
                <Left>
                    <Grid>
                        <Col size={20}>
                            <Thumbnail source={{uri: this.props.companyIcon}}/>
                        </Col>
                        <Col size={65}>
                            <Content style={styles.jobTitle}>
                                <Text style={styles.titleText}>{this.props.title}</Text>
                                <Text style={styles.locationText}>{this.props.city}, {this.props.state}</Text>
                            </Content>
                        </Col>
                        <Col size={15}>
                            <View>
                                <Body>
                                    <Body>
                                        <TouchableHighlight underlayColor="white" onPress={() => this.saveJob()}>
                                            <Icon style={{color: '#9B59B6'}} name={this.state.jobSaved? "ios-heart" : "ios-heart-outline"}/>
                                        </TouchableHighlight>
                                        <Text style={styles.dayText}>{this.props.daysOld}d</Text>
                                    </Body>
                                </Body>
                            </View>
                        </Col>
                    </Grid>
                </Left>
            </CardItem>
                <Footer style={styles.footer}>
                    <FooterTab>
                        <Button full small style={styles.homesButton}>
                            <Text style={styles.buttonText}>Homes</Text>
                        </Button>
                        <Button full small style={styles.activitiesButton}>
                            <Text style={styles.buttonText}>Activities</Text>
                        </Button>
                        <Button full small style={styles.jobPostingButton} onPress={() => {Linking.openURL(this.props.url).catch(err => console.error('An error occurred', err));}}>
                            <Text style={styles.buttonText}>Full Posting</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Content>
        );
    }
}

const styles = StyleSheet.create({
    jobTitle: {
        marginTop: 5
    },
    locationText: {
        fontSize: 14
    },
    dayText: {
        fontSize: 12
    },
    footer: {
        height: 30
    },
    buttonText: {
        color: 'white'
    },
    homesButton: {
        backgroundColor: '#AEA8D3'
    },
    activitiesButton: {
        backgroundColor: '#726D93'
    },
    jobPostingButton: {
        backgroundColor: '#494763'
    }
});
