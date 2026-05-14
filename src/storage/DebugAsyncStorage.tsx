import React from 'react';
import { Button, View } from 'react-native';
import { asyncStorageClient } from './asyncStorageClient';

const DebugAsyncStorage: React.FC = () => {
    const logStorage = async () => {
        try {
            const stores = await asyncStorageClient.getAllItems();
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
