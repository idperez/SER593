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

const cities = [
    {
        city: "california",
        state: "cali"
    } ,
    {
        city: "california",
        state: "cali"
    },
    {
        city: "california",
        state: "cali"
    },
    {
        city: "california",
        state: "cali"
    }
];

export default class CityMatch extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cityMatch: [],
            cityMatchList: []
        }
    };

    initializeCityMatch = () => {
        return new Promise((resolve, reject) => {
            profile.getProfile().then(profile => {
                resolve(profile.cityMatch);
            }).catch(err => {
                throw err;
            });
        });
    };

    reloadCityMatch = () => {
        setTimeout(() => {
            profile.getProfile().then(profile => {
                this.setState({cityMatch: profile.cityMatch});
            }).catch(err => {
                throw err;
            });
        }, 3000);
    };

    displayList = () => {
        return (
            <View>
                {this.state.cityMatch.map((city, index) =>
                <CityCard
                    key={index}
                    city={city.city}
                    state={city.state}
                    rating={city.rating}
                />)}
            </View>
        );
    };

    componentDidMount() {
        this.initializeCityMatch().then(cityMatch => {
            this.setState({cityMatch});
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
