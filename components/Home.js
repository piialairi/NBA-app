import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import UserImage from '../assets/image.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ user, logOut, userEmail, username }) {
    console.log('User prop:', user);
    const handleLogOut = () => {
        logOut();
    };

    useEffect(() => {
        console.log('User prop in HomeScreen:', user);
    }, [user]);


    return (
        < ImageBackground
            source={UserImage}
            style={styles.backgroundImage}
            opacity={1}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonContainer} onPress={handleLogOut}>
                    <Ionicons name="log-out" size={40} color="white" />
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.greetingText}>Hello {user ? user.displayName : 'Unknown user'}!</Text>
                </View>
                <View style={styles.emptySpace}></View>
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>Welcome to discover NBA statistics and make your own bets! Please check the incoming games and place your bets before the games start.</Text>
                </View>
            </View>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    greetingText: {
        marginRight: 50,
        fontSize: 20,
        color: 'white',
        paddingTop: 50,
        fontWeight: 'bold'
    },
    emptySpace: {
        flex: 8,
    },
    textWrapper: {
        position: 'absolute',
        top: 500,
        left: 10,
        right: 10,
    },
    text: {
        fontSize: 16,
        color: 'white'
    },
    imageContainer: {
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    buttonText: {
        marginLeft: 5,
        fontSize: 12,
        color: 'white',
    },
    userImage: {
        width: 200,
        height: 150,
        borderRadius: 0,
    },
});
