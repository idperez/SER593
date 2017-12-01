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

import Toast from 'react-native-root-toast';

import remove from './../../../../../../lib/jobs/save';

export default class SavedJobs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            savedJobs: []
        };
    }

    removeJob = (jobkey) => {
        remove.removeJob(jobkey).then(res => {
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

            this.getSavedJobs().then(result => {
                this.setState({
                    savedJobs: result
                });
            });
        }).catch(err => {
            throw err;
        });
    };

    getSavedJobs = () => {
        return new Promise((resolve, reject) => {
            profile.getProfile().then(profile => {
                resolve(profile.prefs_jobs_saved)
            }).catch(err => {
                throw err;
            });
        });
    };

    displayList = () => {
        return (
            <View>
                {this.state.savedJobs.map((job, index) =>
                    <JobCard
                        key={job.jobkey}
                        city={job.city}
                        state={job.state}
                        daysOld={job.formattedRelativeTime}
                        title={job.jobtitle}
                        company={job.company}
                        jobkey={job.jobkey}
                        removeJob={this.removeJob}
                    />)
                }
            </View>
        );
    };

    componentWillReceiveProps() {
        this.getSavedJobs().then(result => {
            this.setState({
                savedJobs: result
            });
        });
    }

    componentDidMount() {
        this.getSavedJobs().then(result => {
            this.setState({
                savedJobs: result
            });
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    {this.displayList()}
                </Content>
            </Container>
        );
    }
}
