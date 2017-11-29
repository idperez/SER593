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

import PercentageCircle from 'react-native-percentage-circle';

import Collapsible from 'react-native-collapsible';

export default class CEORating extends Component {

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
                    <Text>CEO Rating</Text>
                    <TouchableOpacity onPress={() => this.showMore()}>
                        <Icon name={this.state.arrowDown ? 'arrow-down' : 'arrow-up'}/>
                    </TouchableOpacity>
                    <Collapsible collapsed={this.state.collapseContent}>
                        <Body>
                        <Thumbnail source={{uri: this.props.url}}/>
                        <Text style={styles.ratingText}>{this.props.name}</Text>
                        <PercentageCircle radius={25} percent={this.props.approval} color={"#9B59B6"}/>
                        <Text style={styles.ratingText}>Approval Rating</Text>
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
    ratingText: {
        fontSize: 10,
        marginTop: 4,
        marginBottom: 4
    }
});
