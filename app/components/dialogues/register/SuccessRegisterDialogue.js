import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import PopupDialog, {
    DialogTitle,
    ScaleAnimation,
} from 'react-native-popup-dialog';

import {
    Button,
    Footer,
    FooterTab,
    Text,
    Icon
} from 'native-base';

import { createAnimatableComponent, View } from 'react-native-animatable';

import { Actions } from 'react-native-router-flux';

const scaleAnimation = new ScaleAnimation();

export default class SuccessRegisterDialogue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            toggledOn: <View>
                <Text>loading</Text>
            </View>,
        };

        this.showSuccessfulRegistrationDialog = this.showSuccessfulRegistrationDialog.bind(this);
    }

    showSuccessfulRegistrationDialog() {
        this.scaleAnimationDialog.show();
        this.setState({toggledOn: <View animation="tada" style={{flex: 1}}>
            <Button full style={styles.preferences} onPress={() => Actions.pref()}>
                <Text style={styles.buttonText}>Preferences</Text>
            </Button>
        </View>});
    }

    dismissSuccessfulRegistrationDialog() {
        this.scaleAnimationDialog.dismiss();
    }

    render() {
        return (
            <View style={styles.container}>
                <PopupDialog
                    width={350}
                        ref={(popupDialog) => {
                        this.scaleAnimationDialog = popupDialog;
                    }}
                    dialogAnimation={scaleAnimation}
                    dialogTitle={<DialogTitle title="Success! You are registered." />}
                >
                    <View style={styles.dialogContentView}>
                        <Icon style={{fontSize: 50, color: 'blue'}} name="beer" />
                        <Text>Welcome to Topia!</Text>
                        <Text>Edit your preferences for the best results.</Text>
                    </View>
                    <Footer>
                        <FooterTab>
                            {this.state.toggledOn}
                            <View style={{flex: 1}}>
                                <Button full style={styles.explore} onPress={() => this.dismissSuccessfulRegistrationDialog()}>
                                    <Text style={styles.buttonText}>Explore</Text>
                                </Button>
                            </View>
                        </FooterTab>
                    </Footer>
                </PopupDialog>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute"
    },
    dialogContentView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    buttonText: {
        color: 'white'
    },
    preferences: {
        backgroundColor: '#9B59B6'
    },
    explore: {
        backgroundColor: '#674172'
    },
    toggle: {
        width: 120,
        backgroundColor: '#333',
        borderRadius: 3,
        padding: 5,
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center',
        margin: 10,
        color: 'rgba(255, 255, 255, 1)',
    },
    toggledOn: {
        color: 'rgba(255, 33, 33, 1)',
        fontSize: 16,
        transform: [{
            rotate: '8deg',
        }, {
            translateY: -20,
        }],
    }
});