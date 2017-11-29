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

export default class JobFooter extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Footer>
                <FooterTab>
                    <Button full style={styles.fullJobButton} onPress={() => {Linking.openURL(this.props.url).catch(err => console.error('An error occurred', err));}}>
                        <Text style={styles.buttonText}>See Full Job</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

const styles = StyleSheet.create({
    fullJobButton: {
        backgroundColor: '#9B59B6'
    },
    buttonText: {
        color: 'white'
    }
});
