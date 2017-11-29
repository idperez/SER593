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

import PercentageCircle from 'react-native-percentage-circle';

export default class TopRating extends Component {

    render() {
        const overall = Math.floor(this.props.overall * 20);
        return (
            <Card>
                <CardItem>
                    <Body>
                    <Body>
                    <Text>About {this.props.company}</Text>
                    <Grid style={styles.container}>
                        <Col>
                            <Body>
                            <PercentageCircle radius={25} percent={overall} color={"#9B59B6"}/>
                            <Text style={styles.ratingText}>Overall Review</Text>
                            </Body>
                        </Col>
                        <Col>
                            <Body>
                            <PercentageCircle radius={25} percent={this.props.recommend} color={"#9B59B6"}/>
                            <Text style={styles.recommendText}>Recommend to a friend</Text>
                            </Body>
                        </Col>
                    </Grid>
                    </Body>
                    </Body>
                </CardItem>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5
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
