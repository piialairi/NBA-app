import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserImage from '../assets/image.jpg';

export default function GameScreen() {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={UserImage}
            style={styles.backgroundImage}
            opacity={1}
        >
            <View style={styles.container}>
                <View style={styles.textWrapper} >
                    <TouchableOpacity onPress={() => navigation.navigate('Team Info')}>
                        <Text style={styles.text}>Go to Team Info</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.textWrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate('Game Info')}>
                        <Text style={styles.text}>Go to Game Info</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.textWrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate('Standings East')}>
                        <Text style={styles.text}>Go to East Conference Standings</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.textWrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate('Standings West')}>
                        <Text style={styles.text}>Go to West Conference Standings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'flex-start',
        padding: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: 'white',
        marginVertical: 2,
    },
    textWrapper: {
        marginVertical: 5,

    },
});