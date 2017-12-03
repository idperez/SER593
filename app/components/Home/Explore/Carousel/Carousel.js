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

const CANCEL_INDEX = 0;
const UNSAVE_INDEX = 1;
const options = [ 'Cancel', 'Unsave' ];

export default class Carousel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showJobOptions: true,
            arrowIconUp: true
        };
    }

    render() {
        return (
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
