import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/data';

import { View, Text, StyleSheet } from 'react-native';
import { useOffline } from '../hooks/useOffline';

export default function RootLayout() {
    const { isOffline } = useOffline();

    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            
            {isOffline && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>⚠️ Offline Mode - Using Cached Data</Text>
                </View>
            )}

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="workshop/[id]"
                    options={{
                        headerShown: true,
                        headerTitle: 'Workshop Details',
                        headerStyle: { backgroundColor: COLORS.surface },
                        headerTintColor: COLORS.textPrimary,
                        presentation: 'card',
                    }}
                />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    offlineBanner: {
        backgroundColor: '#f59e0b',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44, // For notched phones
    },
    offlineText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
});
