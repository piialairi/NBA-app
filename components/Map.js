import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';

const API_URL = `http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}`;

const defaultLocation = "Helsinki";

export default function MapScreen({ route }) {
    const arena = route.params?.arena;
    const city = route.params?.city;
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0222,
        longitudeDelta: 0.0121
    });
    const [searchLocation, setSearchLocation] = useState('');

    useEffect(() => {
        if (arena || city) {
            if (city) {
                fetchCoordinates(`${city}`);
            } else {
                fetchCoordinates(`${arena.city}, ${arena.name}`);
            }
        } else {
            fetchCoordinates(defaultLocation);
        }
    }, [arena, city]);

    const fetchCoordinates = async (location) => {
        console.log(`${API_URL}&location=${location}`);
        console.log("Fetching coordinates for:", location);
        try {
            const response = await fetch(`${API_URL}&location=${location}`);
            const responseData = await response.json();
            console.log("Response data:", responseData);

            if (responseData.results && responseData.results.length > 0) {
                const locationData = responseData.results[0].locations[0].latLng;
                setRegion({
                    latitude: locationData.lat,
                    longitude: locationData.lng,
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0121
                });
            } else {
                console.error("Location data not found");
            }
        } catch (error) {
            console.error("Error fetching location data:", error);
        }
    };

    const handleSearch = () => {
        if (searchLocation) {
            fetchCoordinates(searchLocation);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={{ flex: 1 }}
                region={region}>
                <Marker
                    coordinate={{
                        latitude: region.latitude, longitude: region.longitude
                    }}
                />
            </MapView>
            <View style={styles.buttonContainer}>
                <TextInput
                    placeholder="Enter address or location"
                    style={{ height: 40, fontSize: 18, marginTop: 10, marginBottom: 10 }}
                    onChangeText={(text) => setSearchLocation(text)}
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={handleSearch}>
                    <Ionicons name="search" size={35} color="blue" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
});
