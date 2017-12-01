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

import TopRating from './Components/TopRating';

import OtherRatings from './Components/OtherRatings';

import CEORating from './Components/CEORating';

import Video from './Components/Video';

export default class JobProfile extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { company } = this.props;
        const { job } = this.props;
        return (
            <Container style={styles.container}>
                <Content>
                    <JobHeader title={job.company}/>
                    <JobTitle
                        companyIcon={company.squareLogo ? company.squareLogo : "https://cdn.pixabay.com/photo/2017/07/31/16/13/briefcase-2558671__480.jpg" }
                        daysOld={job.formattedRelativeTime}
                        title={job.jobtitle}
                        city={job.city}
                        state={job.state}
                        url={job.url}
                        jobkey={job.jobkey}
                    />
                    {(company.overallRating && company.recommendToFriendRating) ?
                        <TopRating
                            company={job.company}
                            overall={company.overallRating}
                            recommend={company.recommendToFriendRating}
                        />
                        :
                        <View/>
                    }
                    <Grid>
                        {(company.cultureAndValuesRating
                        && company.seniorLeadershipRating
                        && company.compensationAndBenefitsRating
                        && company.careerOpportunitiesRating
                        && company.workLifeBalanceRating) ?
                            <Col>
                                <OtherRatings
                                    culture={company.cultureAndValuesRating}
                                    leadership={company.seniorLeadershipRating}
                                    compensation={company.compensationAndBenefitsRating}
                                    opportunities={company.careerOpportunitiesRating}
                                    life={company.workLifeBalanceRating}
                                />
                            </Col>
                            :
                            <View/>
                        }
                        {company.ceo &&
                         company.ceo.image?
                            <Col>
                                <CEORating
                                    url={company.ceo.image.src}
                                    name={company.ceo.name}
                                    approval={company.ceo.pctApprove}
                                />
                            </Col>
                               :
                            <View/>
                        }
                    </Grid>
                    <Video company={job.company} />
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
