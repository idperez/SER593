import React, { Component } from 'react';

import {
    Image,
    StyleSheet,
    Text
} from 'react-native';

import { Router, Scene } from 'react-native-router-flux';

import SplashContainer from './splash/SplashContainer';

import Landing from './landing/Landing';

import Login from './login/Login';

import Register from './register/Register';

import MapDemo from './map/MapDemo';

import Home from './Home/Explore/Home';

import Saves from './Home/Saves/Saves';

import Preferences from './Home/Preferences/Preferences';

import Other from './Home/Other/Other';

class TabIcon extends React.Component {
    render(){
        return (
            <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
        );
    }
}

export default class App extends Component {

    render() {
        return (
            <SplashContainer>
                <Router>
                    <Scene key="root">
                        <Scene
                            key="landing"
                            component={Landing}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                            initial
                        />
                        <Scene
                            key="explore"
                            component={MapDemo}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            backButtonBarStyle={{ color: '#9B59B6' }}
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                            backTitle=" "
                        />
                        <Scene
                            key="register"
                            component={Register}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            backButtonBarStyle={{ color: '#9B59B6' }}
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                            backTitle=" "
                        />
                        <Scene
                            key="login"
                            component={Login}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            backButtonBarStyle={{ color: '#9B59B6' }}
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                            backTitle=" "
                        />
                        <Scene
                            key="home"
                            component={Home}
                            title={<Image source={require('./../images/logo/topia-sm.png')} style={styles.image} />}
                            navBarButtonColor='#ffffff'
                            backButtonBarStyle={{ color: '#9B59B6' }}
                            navigationBarStyle={{ backgroundColor: '#9B59B6' }}
                            backTitle=" "
                        />
                        <Scene key="tabbar" tabs={true}>
                            <Scene key="Explore" title="Explore" hideNavBar={true}>
                                <Scene
                                    key="exp"
                                    component={Home}
                                    icon={TabIcon}
                                />
                            </Scene>
                            <Scene key="Saves" title="Saves" hideNavBar={true}>
                                <Scene
                                    key="save"
                                    component={Saves}
                                    icon={TabIcon}
                                />
                            </Scene>
                            <Scene key="Preferences" title="Preferences" hideNavBar={true}>
                                <Scene
                                    key="pref"
                                    component={Preferences}
                                    icon={TabIcon}
                                />
                            </Scene>
                            <Scene key="Other" title="Other" hideNavBar={true}>
                                <Scene
                                    key="other"
                                    component={Other}
                                    icon={TabIcon}
                                />
                            </Scene>
                        </Scene>
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