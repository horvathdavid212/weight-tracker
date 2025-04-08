import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import Settings from './src/screens/Settings';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Weight Tracker' }}
                />
                <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{ title: 'Settings' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
