import React from 'react';
import { Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebugAsyncStorage: React.FC = () => {
    const logStorage = async () => {
        try {
            // Get all keys stored in AsyncStorage
            const keys = await AsyncStorage.getAllKeys();
            // Retrieve all key-value pairs
            const stores = await AsyncStorage.multiGet(keys);
            console.log('AsyncStorage contents:', stores);
        } catch (error) {
            console.error('Error fetching AsyncStorage contents', error);
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <Button title="Log AsyncStorage" onPress={logStorage} />
        </View>
    );
};

export default DebugAsyncStorage;
