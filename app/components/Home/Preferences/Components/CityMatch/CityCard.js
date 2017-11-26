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

import PercentageCircle from 'react-native-percentage-circle';

export default class CityMatch extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card style={styles.card}>
                <CardItem>
                    <Body>
                    <Grid>
                        <Col size={80}>
                            <H2>{this.props.city}</H2>
                            <Text>{this.props.state}</Text>
                        </Col>
                        <Col size={20}>
                            <PercentageCircle radius={25} percent={this.props.rating} color={"#9B59B6"}></PercentageCircle>
                        </Col>
                    </Grid>
                    </Body>
                </CardItem>
                <Footer style={styles.footer}>
                    <FooterTab>
                        <Button full small style={styles.aboutButton}>
                            <Text style={styles.buttonText}>About</Text>
                        </Button>
                        <Button full small style={styles.exploreButton}>
                            <Text style={styles.buttonText}>Explore</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Card>
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
    },
    card: {
        marginTop: 5,
        marginBottom: 5
    }
});
