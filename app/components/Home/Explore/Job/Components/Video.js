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

import YouTube from 'react-native-youtube'

import jobVideo from './../../../../../../lib/jobs/video';

export default class Video extends Component {

    constructor(props) {
        super(props);

        this.state = {
            videoId: ""
        }
    }

    getRecruitingVideo(company) {
        jobVideo.getRecruitingVideo(company).then(videos => {
            if(videos.items) {
                if(videos.items.length > 0) {
                    this.setState({
                        videoId: videos.items[0].id.videoId
                    });
                } else {
                    this.getCompanyVideo(company);
                }
            } else {
                this.setState({
                    videoId: "F_NEIwDiCSw"
                });
            }
        }).catch(err => {
            throw err;
        });
    };

    getCompanyVideo(company) {
        jobVideo.getCompanyVideo(company).then(videos => {
            if(videos.items) {
                if (videos.items.length > 0) {
                    this.setState({
                        videoId: videos.items[0].id.videoId
                    });
                }
            } else {
                this.setState({
                    videoId: "F_NEIwDiCSw"
                });
            }
        }).catch(err => {
            throw err;
        });
    };

    render() {
        return (
            <YouTube
                videoId={this.state.videoId}
                onReady={() => this.getRecruitingVideo(this.props.company)}
                style={{ alignSelf: 'stretch', height: 200, backgroundColor: 'white', marginVertical: 10 }}
            />
        );
    }
}
