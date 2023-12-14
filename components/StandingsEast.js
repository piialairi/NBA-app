import { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { RAPID_API_KEY } from '@env';

const API_OPTIONS = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
};

export default function StandingsEast() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStandings = async () => {
        setIsLoading(true);
        const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2023&conference=east`;

        try {
            const response = await fetch(url, { ...API_OPTIONS });
            const result = await response.json();

            if (result && result.response && result.response.length > 0) {
                const sortedData = result.response.sort((a, b) => a.conference.rank - b.conference.rank);
                setData(sortedData);
            } else {
                setData(null);
                console.log("No game data found");
            }
        } catch (error) {
            console.error(error);
            console.log("An error occurred while fetching standings");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStandings();
    }, []);

    const TeamItem = ({ team }) => (
        <View>
            <Image source={{ uri: team.team.logo }} style={{ width: 50, height: 50 }} />
            <Text>Team: {team.team.name}</Text>
            <Text>Wins: {team.conference.win}</Text>
            <Text>Losses: {team.conference.loss}</Text>
            <Text>Points: {team.win.total}</Text>
            <Text>Rank: {team.conference.rank}</Text>
        </View>
    );

    const itemSeparator = () => (
        <View style={{ width: '100%', height: 1, backgroundColor: '#CED0CE' }} />
    );

    return (
        <View style={styles.container} >
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    ItemSeparatorComponent={itemSeparator}
                    data={data}
                    keyExtractor={(item) => item.team.id.toString()}
                    renderItem={({ item }) => <TeamItem team={item} />}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teamItem: {
        padding: 10,
    },
    logo: {
        width: 50,
        height: 50,
    },
    sectionHeader: {
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#CED0CE',
    },
});