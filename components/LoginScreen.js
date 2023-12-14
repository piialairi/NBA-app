import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, ImageBackground, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { app } from './firebaseConfig';
import UserImage from '../assets/image.jpg';

export default function LoginScreen(props) {
    const auth = getAuth(app);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation();
    const [error, setError] = useState(null);

    // Inside signInWithEmailAndPasswordHandler
    const signInWithEmailAndPasswordHandler = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User successfully logged in:', userCredential.user.uid);
            setError(null);

            if (props.setUser) {
                props.setUser(userCredential.user);
                console.log('setUser called with:', userCredential.user);
            }
            if (props.setUserEmail) {
                props.setUserEmail(email);
                console.log('setUserEmail called with:', email);
            }
        } catch (error) {
            console.log('Error signing in:', error.message);
            setError(error);
        }
    };

    // createUserWithEmailAndPasswordHandler
    const createUserWithEmailAndPasswordHandler = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User successfully signed up:', userCredential.user.uid);

            await updateProfile(auth.currentUser, { displayName: username });

            if (props.setUser) {
                props.setUser(userCredential.user);
            }
            if (props.setUserEmail) {
                props.setUserEmail(email);
            }
            if (props.setUsername) {
                props.setUsername(username);
            }
        } catch (error) {
            console.log('Error signing up:', error.message);
        }
    };

    return (
        < ImageBackground
            source={UserImage}
            style={styles.backgroundImage}
            opacity={1}
        >
            <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center', marginTop: 10 }}>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        onChangeText={setUsername}
                        value={username}
                    />
                    <TextInput style={styles.input}
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                    <TextInput style={styles.input}
                        placeholder="Password"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="Sign In" onPress={signInWithEmailAndPasswordHandler} />
                </View>

                <Text style={{ color: 'red', fontSize: 16 }}>{error && `Error: incorrect credentials`}</Text>
                <View style={styles.emptySpace}></View>
                <View>
                    <Text style={styles.text}>Don't have an account yet? Don't worry, just sign up!</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign Up"
                        onPress={createUserWithEmailAndPasswordHandler}
                    />
                </View>
            </View>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 8,
        padding: 10,
        color: 'black',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 14,
        color: 'white',
        justifyContent: 'center',
        marginTop: 40,
        marginLeft: 40,
        marginRight: 40
    },
})