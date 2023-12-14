import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserImage from '../assets/image.jpg';
import { RAPID_API_KEY } from '@env';

const API_OPTIONS = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
};

export default function GameInfoComponent() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [gameData, setGameData] = useState(null);
    const [date, setDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());

    const fetchNBAgames = async (selectedDate) => {
        setIsLoading(true);

        const url2 = `https://api-nba-v1.p.rapidapi.com/games?date=${selectedDate}`;

        try {
            const response = await fetch(url2, { ...API_OPTIONS });
            const result = await response.json();

            if (result && result.response && result.response.length > 0) {
                setGameData(result.response);
            } else {
                setGameData(null);
                console.log("No game data found");
            }
        } catch (error) {
            console.error(error);
            console.log("An error occurred while fetching games");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNBAgames(date);
    }, [date]);

    const Game = ({ game }) => {
        const navigation = useNavigation();

        const navigateToMap = () => {
            navigation.navigate('Map', { arena: game.arena });
        };

        return (
            <View>
                <Text style={styles.whiteText}>Home Team: {game.teams.home.name}</Text>
                <Text style={styles.whiteText}>Visitor Team: {game.teams.visitors.name}</Text>
                <Text style={styles.whiteText}>Scores: {game.scores.home.points}-{game.scores.visitors.points}</Text>
                <Text style={styles.whiteText}>City: {game.arena.city}</Text>
                <Text style={styles.whiteText}>Arena: {game.arena.name}</Text>
                <TouchableOpacity style={[styles.buttonContainer]} onPress={navigateToMap}>
                    <Ionicons name="map-outline" size={24} color="#97E5EB" />
                    <Text style={[styles.buttonText, styles.whiteText]}>Show Arena</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const ItemSeparator = () => {
        return (
            <View style={{ width: '100%', height: 1, backgroundColor: '#CED0CE' }} />
        );
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setChosenDate(selectedDate);
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const day = selectedDate.getDate();

            const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
            setDate(formattedDate);
            fetchNBAgames(formattedDate);
        }
    };

    return (
        <ImageBackground
            source={UserImage}
            style={styles.backgroundImage}
            opacity={1}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.datePickerContainer}>
                    <Text style={[styles.datePickerText, styles.whiteText]}>Select a date: </Text>
                    <Ionicons
                        name="calendar-outline"
                        size={50}
                        color="white"
                        onPress={showDatePickerModal}
                    />
                </View>
                <Text style={[styles.datePickerText, styles.whiteText]}>Selected date: {date}</Text>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={chosenDate}
                        mode="date"
                        display="spinner"
                        onChange={onDateChange}
                    />
                )}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <FlatList
                        ItemSeparatorComponent={ItemSeparator}
                        data={gameData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Game game={item} />
                        )}
                    />
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    datePickerText: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: "bold",
    },
    selectedDateText: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'left',
        marginTop: 10,
    },
    buttonText: {
        color: 'black',
        marginLeft: 10,
    },
    whiteText: {
        color: 'white',
    },
});
