import React, { Component } from 'react';
import {
    AsyncStorage,
    Image,
    StyleSheet,
    View,
    TouchableOpacity,
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
    FooterTab,
    Row
} from 'native-base';

import { Rating } from 'react-native-ratings';

import Collapsible from 'react-native-collapsible';

export default class OtherRatings extends Component {

    constructor(props) {
        super(props);

        this.state = {
            arrowDown: true,
            collapseContent: true
        }
    }

    showMore() {
        this.setState({
            arrowDown: !this.state.arrowDown,
            collapseContent: !this.state.collapseContent
        });
    }

    render() {
        return (
            <Card>
                <CardItem>
                    <Body>
                    <Body>
                    <Text>More Ratings</Text>
                    <TouchableOpacity onPress={() => this.showMore()}>
                        <Icon name={this.state.arrowDown ? 'arrow-down' : 'arrow-up'}/>
                    </TouchableOpacity>
                    <Collapsible collapsed={this.state.collapseContent}>
                        <Body>
                        <Rating
                            type="star"
                            fractions={1}
                            startingValue={parseInt(this.props.culture)}
                            imageSize={25}
                            style={{ paddingVertical: 10 }}
                        />
                        <Text style={styles.starText}>Culture And Values</Text>
                        <Rating
                            type="star"
                            fractions={1}
                            startingValue={parseInt(this.props.leadership)}
                            imageSize={25}
                            style={{ paddingVertical: 10 }}
                        />
                        <Text style={styles.starText}>Senior Leadership</Text>
                        <Rating
                            type="star"
                            fractions={1}
                            startingValue={parseInt(this.props.compensation)}
                            imageSize={25}
                            style={{ paddingVertical: 10 }}
                        />
                        <Text style={styles.starText}>Compensation and Benefits</Text>
                        <Rating
                            type="star"
                            fractions={1}
                            startingValue={parseInt(this.props.opportunities)}
                            imageSize={25}
                            style={{ paddingVertical: 10 }}
                        />
                        <Text style={styles.starText}>Career Opportunities</Text>
                        <Rating
                            type="star"
                            fractions={1}
                            startingValue={parseInt(this.props.life)}
                            imageSize={25}
                            style={{ paddingVertical: 10 }}
                        />
                        <Text style={styles.starText}>Work Life Balance</Text>
                        </Body>
                    </Collapsible>
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
    starText: {
        fontSize: 10
    }
});
