import React, { Component } from 'react';
import {
    AsyncStorage,
    Image,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Text
} from 'native-base';

import MapView from 'react-native-maps';

import MapSearchBox from './../../map/MapSearchBox';

import SuccessRegisterDialogue from '../../dialogues/register/SuccessRegisterDialogue';

import Carousel from 'react-native-snap-carousel';

import { sliderWidth, itemWidth } from './Carousel/Styles/EntryStyles';
import SliderEntry from './Carousel/Components/SlideEntry';
import carouselStyles from './Carousel/Styles/index.js';

import jobs from './../../../../lib/jobs/jobs';

const SLIDER_1_FIRST_ITEM = 1;

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: "",
            markerLatitude: 37.78825,
            markerLongitude: -122.4324,
            region: {
                latitude: 33.2175824,
                longitude: -111.84066,
                latitudeDelta: 0.3922,
                longitudeDelta: 0.3421
            },
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            slider1Ref: null,
            jobData: [],
            mapMarker: <View/>
        };

        this.getToken();
        this.citySearched.bind(this);
        this.getJobs.bind(this);
    }

    getJobs = () => {
        jobs.getJobInformation(
            this.state.region.latitude,
            this.state.region.longitude
        ).then(jobData => {
            this.setState({
                jobData
            });
            this.setMarkers(jobData);
        }).catch(err => {
            throw err;
        });
    };

    componentDidMount() {
        if(this.props.firstTime) {
            this.refs.firstTime.showSuccessfulRegistrationDialog();
        }
    }

    getToken() {
        AsyncStorage.getItem('token')
            .then((token) => {
                this.setState({token})
        });
    }

    markerPressed(job) {
        alert(job.company);
    }

    setMarkers(jobData) {
        let markers = [];

        jobData.map(
            (job) => {
                markers.push(
                    <MapView.Marker key={job.jobkey}
                        coordinate={{
                            latitude: job.latitude,
                            longitude: job.longitude,
                        }}>
                        <TouchableOpacity style={styles.radius} onPress={this.markerPressed.bind(undefined, job)}>
                            <View style={styles.marker}>

                            </View>
                        </TouchableOpacity>
                    </MapView.Marker>
                )
        });

        this.setState({
            mapMarker: markers
        });

        this.setState({
            region: {
                latitude: jobData[0].latitude,
                longitude: jobData[0].longitude,
                latitudeDelta: 0.3421,
                longitudeDelta: 0.3421
            }
        });
        this._map.animateToRegion(this.state.region, 100);
    }

    citySearched = (latitude, longitude) => {
        this.setState({
            region: {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.3421,
                longitudeDelta: 0.3421
            }
        });
        this._map.animateToRegion(this.state.region, 100);
    };

    _renderItem ({item, index}) {
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
            />
        );
    }

    render() {
        return (
            <Container style={styles.homeContainer}>
                <MapView
                    ref={component => {this._map = component;}}
                    style={styles.map}
                    region={this.state.region}>
                    {this.state.mapMarker}
                </MapView>
                <MapSearchBox citySearched={this.citySearched}/>
                <SuccessRegisterDialogue ref="firstTime"/>
                <View style={styles.carousel} >
                    <Carousel
                        ref={(c) => { if (!this.state.slider1Ref) { this.setState({ slider1Ref: c }); } }}
                        data={this.state.jobData}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        firstItem={SLIDER_1_FIRST_ITEM}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        enableMomentum={false}
                        containerCustomStyle={carouselStyles.slider}
                        contentContainerCustomStyle={carouselStyles.sliderContentContainer}
                        loop={true}
                        loopClonesPerSide={2}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                    />
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1
    },
    map: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute'
    },
    marker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20 / 2,
        overflow: 'hidden',
        backgroundColor: '#9B59B6',
        zIndex: 0
    },
    carousel: {
        marginTop: 450,
        zIndex: 100
    }
});
