import React, { Component } from 'react';

import { StyleSheet, View } from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class MapSearchBox extends Component {
    render() {
        return (
            <View style={styles.searchBox}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    minLength={2} // minimum length of text to search
                    autoFocus={false}
                    fetchDetails={true}
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        alert(JSON.stringify(data));
                        console.log(details);
                    }}
                    getDefaultValue={() => {
                        return ''; // text input default value
                    }}
                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyAEtLBeeFTxB_D-EX_Wo4U-kqov5nprVXQ',
                        language: 'en', // language of the results
                        types: '(cities)', // default: 'geocode'
                    }}
                    styles={{
                        container: {
                            backgroundColor: '#fff',
                            width: 340,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20,
                            marginBottom: 0,
                            opacity: 0.9,
                            borderRadius: 3
                        },
                        description: {
                            fontWeight: 'bold',
                            color: "#007",
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                            opacity: 0.9,
                        },
                        textInputContainer: {
                            height: 50,
                        },
                        textInput: {
                            height: 33,
                            fontSize: 16
                        }
                    }}

                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GoogleReverseGeocodingQuery={{
                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                    }}
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        types: 'cities',
                    }}

                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                    predefinedPlacesAlwaysVisible={true}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    searchBox: {
        top: 0,
        position: "absolute",
        flex: 1,
        justifyContent: 'center',
    }
});