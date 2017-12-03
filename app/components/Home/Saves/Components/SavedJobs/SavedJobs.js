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

import JobCard from './JobCard';

import profile from '../../../../../../lib/profile/profile';

export default class SavedJobs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            savedJobs: []
        };

        this.refreshJobs.bind(this);
        this.getSavedJobs();
    }

    refreshJobs(index) {
        const jobArr = this.state.savedJobs.splice(index, 1);
        this.setState({savedJobs: jobArr});
    }

    getSavedJobs() {
        profile.getProfile().then(profile => {
            const jobs = profile.prefs_jobs_saved;
            let jobsArr = [];

            let index = 0;

            jobs.map(job => {
                jobsArr.push(<JobCard
                    key={job.jobkey}
                    city={job.city}
                    state={job.state}
                    daysOld={job.formattedRelativeTime}
                    title={job.jobtitle}
                    company={job.company}
                    jobkey={job.jobkey}
                    refreshJobs={this.refreshJobs()}
                    index={index}
                />);
                index++;
            });

            this.setState({savedJobs: jobsArr});
        }).catch(err => {
            throw err;
        });
    };

    render() {
        return (
            <Container>
                <Content>
                    {this.state.savedJobs}
                </Content>
            </Container>
        );
    }
}
