import React, { Component } from 'react';

import {
    Image,
    StyleSheet
} from 'react-native';

import { Router, Scene } from 'react-native-router-flux';

import SplashContainer from './splash/SplashContainer';

import Landing from './landing/Landing';

import Login from './login/Login';

import Register from './register/Register';

import MapDemo from './map/MapDemo';

export default class App extends Component {

    render() {
        return (
            <SplashContainer>
                <Router>
                    <Scene key="root">
                        <Scene
                            key="landing"
                            component={Landing}
                            hideNavBar
                            initial={true}
                        />
                        <Scene
                            key="explore"
                            component={MapDemo}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                        />
                        <Scene
                            key="login"
                            component={Login}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                        />
                        <Scene
                            key="register"
                            component={Register}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                        />
                    </Scene>
                </Router>
            </SplashContainer>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        marginTop: -3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backGround: {
        backgroundColor: '#9B59B6'
    }
});