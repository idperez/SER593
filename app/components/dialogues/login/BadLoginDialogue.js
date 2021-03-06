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

import { Actions } from 'react-native-router-flux';

import { createAnimatableComponent, View } from 'react-native-animatable';

const scaleAnimation = new ScaleAnimation();

export default class BadLoginDialogue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            toggledOn: <View>
                <Text>loading</Text>
            </View>,
        };

        this.showBadLoginDialogue = this.showBadLoginDialogue.bind(this);
    }

    showBadLoginDialogue() {
        this.scaleAnimationDialog.show();
    }

    hideBadLoginDialogue() {
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
                    dialogTitle={<DialogTitle title="Hold up!" />}
                >
                    <View style={styles.dialogContentView}>
                        <Icon style={{fontSize: 50, color: 'blue'}} name="sad" />
                        <Text>We can't find a profile with this information.</Text>
                    </View>
                    <Footer>
                        <FooterTab>
                            <View style={{flex: 1}}>
                                <Button full style={styles.tryAgain} onPress={() => this.hideBadLoginDialogue()}>
                                    <Text style={styles.buttonText}>Try Again</Text>
                                </Button>
                            </View>
                            <View style={{flex: 1}}>
                                <Button full style={styles.register} onPress={() => Actions.register({showLogin: false})}>
                                    <Text style={styles.buttonText}>Create Account</Text>
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
    tryAgain: {
        backgroundColor: '#9B59B6'
    },
    register: {
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