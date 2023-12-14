import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/Home';
import StatisticsScreen from './components/Statistics';
import MapScreen from './components/Map';
import BetScreen from './components/Bet';
import LoginScreen from './components/LoginScreen';
import TeamInfo from './components/TeamInfo';
import { getAuth } from 'firebase/auth';
import GameInfo from './components/GameInfo';
import StandingsEast from './components/StandingsEast';
import StandingsWest from './components/StandingsWest';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const GameStack = createStackNavigator();
const auth = getAuth();

function GameStackScreen() {
  return (
    <GameStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
      }}>
      <GameStack.Screen name="Statistics" component={StatisticsScreen} />
      <GameStack.Screen name="Team Info" component={TeamInfo} />
      <GameStack.Screen name="Game Info" component={GameInfo} />
      <GameStack.Screen name="Standings East" component={StandingsEast} />
      <GameStack.Screen name="Standings West" component={StandingsWest} />
      <GameStack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="TeamInfo" component={TeamInfo} />
    </GameStack.Navigator>
  );
}

export default function App() {
  const [userState, setUserState] = useState(null);
  const [userEmailState, setUserEmailState] = useState(null);
  const [username, setUsername] = useState('');

  const setUser = (user, email, username) => {
    console.log('setUser function called with:', user);
    setUserState(user);
    setUserEmailState(email);
    setUsername(username);
  };

  const checkUserLoggedIn = async () => {
    const user = auth.currentUser;
    console.log('User in checkUserLoggedIn:', user);

    setUserState(user);

    if (user) {
      setUserEmailState(user.email);

      const timer = setTimeout(() => {
        setUsername(user.displayName || '');
        console.log('Username in checkUserLoggedIn:', user.displayName || '');
      }, 1000);

      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await checkUserLoggedIn();
    };

    fetchData();
  }, []);

  const logOut = async () => {
    try {
      await auth.signOut();
      setUserState(null);
    } catch (error) {
      console.log('Error signing out:', error.message);
    }
  };

  return (
    <NavigationContainer>
      {userState ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'ios-home' : 'ios-home-outline';
              } else if (route.name === 'NBA Data') {
                iconName = focused ? 'ios-basketball' : 'ios-basketball-outline';
              } else if (route.name === 'Bets') {
                iconName = focused ? 'ios-trophy' : 'ios-trophy-outline';
              } else if (route.name === 'Map') {
                iconName = focused ? 'ios-map' : 'ios-map-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}
          tabBarOptions={{
            style: [{ display: 'flex' }, null],
          }}
        >
          <Tab.Screen
            name="Home"
            options={{
              title: 'Home',
              headerTitleAlign: 'center',
            }}
          >
            {() => <HomeScreen
              user={userState}
              userEmail={userEmailState}
              logOut={logOut}
              username={username} />}
          </Tab.Screen>
          <Tab.Screen
            name="NBA Data"
            component={GameStackScreen}
            options={{
              title: 'NBA Data',
              headerTitleAlign: 'center',
            }}
          />
          <Tab.Screen
            name="Bets"
            component={BetScreen}
            options={{
              title: 'Bets',
              headerTitleAlign: 'center',
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              title: 'Map',
              headerTitleAlign: 'center',
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} setUser={setUser} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
