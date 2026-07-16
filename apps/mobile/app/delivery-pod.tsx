import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/data';
import { useRouter } from 'expo-router';

export default function DeliveryPodScreen() {
    const router = useRouter();
    const [status, setStatus] = useState<'pending' | 'signed'>('pending');

    const handleSign = () => {
        // In reality, this would open a canvas to draw a signature
        setStatus('signed');
    };

    const handleSubmit = () => {
        alert('Proof of Delivery saved offline. Will sync when connection restores.');
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} onPress={() => router.back()} />
                <Text style={styles.headerTitle}>Proof of Delivery</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.shipmentCard}>
                    <Text style={styles.label}>Shipment #</Text>
                    <Text style={styles.value}>SHP-8472-X</Text>
                    <Text style={styles.label}>Delivery Address</Text>
                    <Text style={styles.value}>14 Awolowo Rd, Ikoyi, Lagos</Text>
                    <Text style={styles.label}>Receiver</Text>
                    <Text style={styles.value}>FMCG Distributors Ltd</Text>
                </View>

                <View style={styles.signatureBox}>
                    {status === 'pending' ? (
                        <TouchableOpacity style={styles.signButton} onPress={handleSign}>
                            <MaterialCommunityIcons name="draw" size={32} color={COLORS.primary} />
                            <Text style={styles.signButtonText}>Tap to Sign</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.signedState}>
                            <MaterialCommunityIcons name="check-circle" size={48} color={COLORS.green} />
                            <Text style={styles.signedText}>Signature Captured</Text>
                        </View>
                    )}
                </View>
                
                <TouchableOpacity style={styles.photoButton}>
                    <MaterialCommunityIcons name="camera" size={24} color={COLORS.textPrimary} />
                    <Text style={styles.photoButtonText}>Capture Photo (Optional)</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.submitButton, status === 'pending' && styles.submitButtonDisabled]} 
                    disabled={status === 'pending'}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Complete Delivery</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    content: { padding: 20, flex: 1 },
    shipmentCard: { backgroundColor: COLORS.surfaceAccent, padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
    label: { color: COLORS.textSecondary, fontSize: 12, marginTop: 10 },
    value: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600' },
    signatureBox: { height: 200, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    signButton: { alignItems: 'center' },
    signButtonText: { color: COLORS.primary, marginTop: 8, fontWeight: '600' },
    signedState: { alignItems: 'center' },
    signedText: { color: COLORS.green, marginTop: 8, fontWeight: '700' },
    photoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: COLORS.surfaceAccent, borderRadius: 12, marginBottom: 'auto' },
    photoButtonText: { marginLeft: 8, fontWeight: '600', color: COLORS.textPrimary },
    submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
    submitButtonDisabled: { backgroundColor: COLORS.border },
    submitButtonText: { color: 'white', fontWeight: '700', fontSize: 16 }
});
