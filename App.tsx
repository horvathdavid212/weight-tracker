import React from 'react';
import { LogBox } from 'react-native';
import { useGlobalErrorHandler } from './src/app/useGlobalErrorHandler';
import ErrorFallback from './src/components/ErrorFallback';
import AppNavigator from './src/navigation/AppNavigator';
import AppProviders from './src/providers/AppProviders';

// Ignore specific warnings that might not be relevant
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function App() {
    const error = useGlobalErrorHandler();

    if (error) {
        return <ErrorFallback error={error} />;
    }

    return (
        <AppProviders>
            <AppNavigator />
        </AppProviders>
    );
}
