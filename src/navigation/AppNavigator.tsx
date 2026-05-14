import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderIcon from '../components/ui/HeaderIcon';
import LoadingFallback from '../components/LoadingFallback';
import HomeScreen from '../screens/HomeScreen';
import Settings from '../screens/Settings';
import { colors } from '../theme';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer fallback={<LoadingFallback />}>
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
          cardStyle: { backgroundColor: colors.background.main },
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
};

export default AppNavigator;
