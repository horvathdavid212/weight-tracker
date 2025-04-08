import React, { useState, useEffect } from 'react';
import { StatusBar, View, Text, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from './src/theme';
import { HeaderIcon } from './src/components/ui';

import HomeScreen from './src/screens/HomeScreen';
import Settings from './src/screens/Settings';

const Stack = createStackNavigator();

// Ignore specific warnings that might not be relevant
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function App() {
    const [error, setError] = useState<Error | null>(null);

    // Add global error handler
    useEffect(() => {
        const errorHandler = (error: Error) => {
            console.log('Global error caught:', error);
            setError(error);
        };

        // Set up global error handler
        const subscription = global.ErrorUtils.setGlobalHandler(errorHandler);

        return () => {
            // Clean up error handler on unmount
            global.ErrorUtils.setGlobalHandler(subscription);
        };
    }, []);

    // If there's an error, show error screen instead of app
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.background.main }}>
                <Text style={{ color: colors.status.error, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    Something went wrong!
                </Text>
                <Text style={{ color: colors.text.primary, textAlign: 'center', marginBottom: 20 }}>
                    {error.message}
                </Text>
                <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                    Please restart the app or contact support.
                </Text>
            </View>
        );
    }

    return (
        <NavigationContainer
            fallback={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.main }}>
                    <Text style={{ color: colors.text.primary }}>Loading...</Text>
                </View>
            }
        >
            <StatusBar
                backgroundColor={colors.primary.main}
                barStyle="light-content"
            />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.primary.main,
                    },
                    headerTintColor: colors.text.primary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    cardStyle: { backgroundColor: colors.background.main }
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        title: 'Weight Tracker',
                        headerRight: () => (
                            <HeaderIcon
                                iconName="settings-outline"
                                size={24}
                                color={colors.secondary.main}
                                onPress={() => navigation.navigate('Settings')}
                            />
                        ),
                    })}
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
