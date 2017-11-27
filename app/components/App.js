import React, { Component } from 'react';

import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    Icon
} from 'native-base';

import { Router, Scene } from 'react-native-router-flux';

import SplashContainer from './splash/SplashContainer';

import Landing from './landing/Landing';

import Login from './login/Login';

import Register from './register/Register';

import Home from './Home/Explore/Home';

import Saves from './Home/Saves/Saves';

import Preferences from './Home/Preferences/Preferences';

import Other from './Home/Other/Other';

class TabIcon extends Component {
    render() {
        var color = this.props.selected ? '#00f240' : '#301c2a';

        return (
            <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
                <Icon style={{color: color}} name={this.props.iconName || "home"} size={18}/>
            </View>
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
                            hideNavBar={true}
                            initial
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
                        <Scene key="tabbar" tabs={true}>
                            <Scene key="Explore" hideNavBar={true}>
                                <Scene
                                    key="exp"
                                    component={Home}
                                    iconName="home"
                                    icon={TabIcon}
                                />
                            </Scene>
                            <Scene key="Saves" title="Saves" hideNavBar={true}>
                                <Scene
                                    key="save"
                                    component={Saves}
                                    iconName="ios-heart-outline"
                                    icon={TabIcon}
                                />
                            </Scene>
                            <Scene key="Preferences" title="Preferences" hideNavBar={true}>
                                <Scene
                                    key="pref"
                                    component={Preferences}
                                    icon={TabIcon}
                                    iconName="ios-person-outline"
                                />
                            </Scene>
                            <Scene key="Other" hideNavBar={true}>
                                <Scene
                                    key="other"
                                    component={Other}
                                    icon={TabIcon}
                                    iconName="ios-list-box-outline"
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