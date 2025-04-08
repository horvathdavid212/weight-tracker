import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import DebugAsyncStorage from "../storage/DebugAsyncStorage";
import DummyDataManager from "./DummyDataManager";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

interface DebugPanelProps {
    onDataChange: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onDataChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const togglePanel = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    // Triple tap handler could be added here if desired
    const handleLongPress = () => {
        togglePanel();
    };

    return (
        <View style={styles.container}>
            {isExpanded ? (
                <View style={styles.panel}>
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={togglePanel}
                    >
                        <Text style={styles.closeButtonText}>Hide Debug Panel</Text>
                    </TouchableOpacity>
                    <DebugAsyncStorage />
                    <DummyDataManager onDataChange={onDataChange} />
                </View>
            ) : (
                <TouchableOpacity 
                    style={styles.debugButton}
                    onLongPress={handleLongPress}
                >
                    <Text style={styles.debugButtonText}>•••</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1000,
    },
    panel: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 10,
        borderBottomLeftRadius: 10,
        minWidth: 'auto',
    },
    debugButton: {
        padding: 10,
        backgroundColor: 'transparent',
    },
    debugButtonText: {
        color: '#666',
        fontSize: 20,
        letterSpacing: 2,
    },
    closeButton: {
        padding: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default DebugPanel;