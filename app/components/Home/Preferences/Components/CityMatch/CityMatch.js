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
    Icon,
    FooterTab,
    Grid,
    Col,
    H2
} from 'native-base';

import CityCard from './CityCard';

import profile from '../../../../../../lib/profile/profile';

export default class CityMatch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: <View/>
        };

        this.getCityMatches();
    }

    getCityMatches() {
        profile.getProfile().then(profile => {
            const cities = profile.cityMatch;
            let cityArr = [];

            let index = 0;

            for(let city in cities) {
                let data = cities[city];
                cityArr.push(<CityCard
                    key={index}
                    city={data.city}
                    state={data.state}
                    rating={data.rating}
                />);
                index++;
            }
            this.setState({cities: cityArr});
        }).catch(err => {
            throw err;
        });
    };

    render() {
        return (
            <Container>
                <Content>
                    {this.state.cities}
                </Content>
            </Container>
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
        backgroundColor: '#726D93'
    },
    footer: {
        height: 30
    }
});
