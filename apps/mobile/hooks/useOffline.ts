import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useOffline() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable !== false);
            setIsOffline(offline);
        });

        return () => removeNetInfoSubscription();
    }, []);

    const saveData = async (key: string, data: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving data offline', e);
        }
    };

    const getData = async <T>(key: string): Promise<T | null> => {
        try {
            const val = await AsyncStorage.getItem(key);
            return val ? JSON.parse(val) : null;
        } catch (e) {
            console.error('Error getting offline data', e);
            return null;
        }
    };

    return { isOffline, saveData, getData };
}
