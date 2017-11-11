import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View
} from 'react-native';

import MapView from 'react-native-maps';

import MapSearchBox from './MapSearchBox';

export default class MapDemo extends Component {

    render() {
        return (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}>
                    <MapSearchBox/>
                    <MapView.Marker
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                        }}>
                        <View style={styles.radius}>
                            <View style={styles.marker}>

                            </View>
                        </View>
                    </MapView.Marker>
                </MapView>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute'
    },
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        borderWidth: 0,
        borderColor: 'rgba(0, 122, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 20 / 2,
        overflow: 'hidden',
        backgroundColor: '#007AFF'
    }
});
