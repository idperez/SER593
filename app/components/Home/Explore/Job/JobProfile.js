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

import JobHeader from './Components/JobHeader';

import JobTitle from './Components/JobTitle';

import JobFooter from './Components/JobFooter';

import TopRating from './Components/TopRating';

import OtherRatings from './Components/OtherRatings';

import CEORating from './Components/CEORating';

import Video from './Components/Video';

export default class JobProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            video: <View/>
        };
    }

    render() {
        return (
            <Container style={styles.container}>
                <Content>
                    <JobHeader title="Garmin"/>
                    <JobTitle
                        companyIcon="https://media.glassdoor.com/sqls/12667/garmin-squarelogo-1470061748290.png"
                        daysOld="13"
                        title="Software Engineer 1"
                        city="Chandler"
                        state="AZ"
                        url="http://www.indeed.com/viewjob?jk=440966298f2524a6&qd=AHBv2aSOJz5QeLJ8HScbwOCGNrM6JWIrPXRWz-lk3Z-lAxUFdHl0o3f_kXYP_3W8sqo2-h2X5iMb9B7ISxmiCi_9-lsXIosBqhLuZL1-euySLPY5W3V58OPvgfARweeS6oc3nzBK-77NWsOXheHOMA&indpubnum=7658403343281086&atk=1bvvla63pa3d49sh"
                    />
                    <TopRating
                        company="Garmin"
                        overall={3.6}
                        recommend={55}
                    />
                    <Grid>
                        <Col>
                            <OtherRatings
                                culture={3.6}
                                leadership={2.0}
                                compensation={3.0}
                                opportunities={3.4}
                                life={2.3}
                            />
                        </Col>
                        <Col>
                            <CEORating
                                url="https://media.glassdoor.com/people/sqll/3520/mazda-masamichi-kogai.png"
                                name="Masamichi Kogai"
                                approval={53}
                            />
                        </Col>
                    </Grid>
                    <Video company="garmin"/>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    ratingText: {
        fontSize: 10,
        marginTop: 4
    },
    recommendText: {
        fontSize: 10,
        marginTop: 4
    }
});
