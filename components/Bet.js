import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity } from "react-native";
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserImage from '../assets/image.jpg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig, 'app1');
const database = getDatabase(app);

export default function BetScreen() {
    const auth = getAuth();
    const [result, setresult] = useState('');
    const [teams, setTeams] = useState('');
    const [items, setItems] = useState([]);
    const [user, setUser] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        onValue(ref(database, 'items/'), (snapshot) => {
            const data = snapshot.val();
            const keys = Object.keys(data);
            // Combine keys with data 
            const dataWithKeys = Object.values(data).map((obj, index) => {
                return { ...obj, key: keys[index] }
            });

            setItems(dataWithKeys);
            setTeams('');
            setresult('');
            setUser('');
        })
    }, [database]);

    const saveItem = () => {
        if (result && teams && currentUser) {
            push(ref(database, 'items/'), {
                'teams': teams, 'result': result, 'user': currentUser.email
            });
        } else {
            Alert.alert('Error', 'Please fill in all the fields: Teams and Result');

        }
    }


    const deleteItem = (key, itemUser) => {
        console.log('currentUser.uid:', currentUser ? currentUser.uid : 'null');
        console.log('itemUser:', itemUser);

        if (currentUser && currentUser.email === itemUser) {
            remove(ref(database, `items/${key}`));
        } else {
            Alert.alert('Error', 'You are not authorized to delete this item.');
        }
    }


    return (
        <ImageBackground
            source={UserImage}
            style={styles.backgroundImage}
            opacity={1}
        >
            <View style={styles.container}>
                <TextInput
                    placeholder='Teams'
                    style={styles.input}
                    onChangeText={(teams) => setTeams(teams)}
                    value={teams}
                />
                <TextInput
                    placeholder='Result'
                    style={styles.input}
                    onChangeText={(result) => setresult(result)}
                    value={result}
                />
                <Button style={styles.buttonContainer} onPress={saveItem} title="Save" />
                <Text style={{ marginBottom: 10, fontWeight: "bold", marginTop: 30, fontSize: 20, color: 'white' }}>The Bets</Text>
                <FlatList
                    style={styles.list}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listcontainer}>
                            <Text style={styles.text}>{item.teams}, {item.result}, {item.user}</Text>
                            {currentUser && currentUser.email === item.user && (
                                <TouchableOpacity onPress={() => deleteItem(item.key, item.user)}>
                                    <Ionicons name="trash-outline" size={24} color="#CC0000" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    data={items}
                />

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        marginTop: 5,
        fontSize: 14,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 5
    },
    listcontainer: {
        flex: 1,
        flexDirection: 'row',
    },
    list: {
        marginLeft: '5%',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        color: 'white',
        fontWeight: "bold"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
});