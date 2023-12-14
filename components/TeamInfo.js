import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserImage from '../assets/image.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RAPID_API_KEY } from '@env';

export default function TeamInfo() {
    const API_OPTIONS = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
        }
    };

    const navigation = useNavigation();

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [city, setCity] = useState('');

    const fetchNBAData = async () => {
        setIsLoading(true);
        const url = `https://api-nba-v1.p.rapidapi.com/teams?search=${keyword}`;

        try {
            const response = await fetch(url, { ...API_OPTIONS });
            const result = await response.json();

            if (result.response && result.response.length > 0) {
                setData(result.response[0]);
                setCity(result.response[0].city);
            } else {
                setData(null);
                setCity('N/A');
                console.log("No data found");
            }
        } catch (error) {
            console.error(error);
            console.log("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNBAData();
    }, []);

    const navigateToMap = () => {
        console.log("Navigating to Map with city:", city);
        navigation.navigate('Map', { city: city });
    };

    return (
        < ImageBackground
            source={UserImage}
            style={styles.backgroundImage}
            opacity={1}
            resizeMode='cover'
        >
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={keyword}
                    onChangeText={text => setKeyword(text)}
                    placeholder="Enter Team Code (e.g., ATL)"
                />
                <Button title="Get Team Info" onPress={fetchNBAData} />
                {isLoading ? (
                    <Text>Loading data...</Text>
                ) : data ? (
                    <View style={styles.content}>
                        <Text style={styles.whiteText}>Team Name: {data.name || 'N/A'}</Text>
                        <Text style={styles.whiteText}>Team Nickname: {data.nickname || 'N/A'}</Text>
                        <Text style={styles.whiteText}>Code: {data.code || 'N/A'}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.whiteText}>City: {city}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                                <TouchableOpacity style={styles.buttonContainer} onPress={navigateToMap}>
                                    <Ionicons name="map-outline" size={24} color="#97E5EB" />
                                </TouchableOpacity>
                                <Text style={[styles.buttonText, styles.whiteText]}>Show Arena</Text>
                            </View>
                        </View>

                        <Text style={styles.whiteText}></Text>
                        <Image
                            source={{ uri: data.logo }}
                            style={{ width: 100, height: 100 }}
                        />
                    </View>
                ) : (
                    <Text style={styles.whiteText}>No data available.</Text>
                )}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,

    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        marginTop: 20,
        fontSize: 14,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 5,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    whiteText: {
        color: 'white',
    },
});

