import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PartnerSignupScreen() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    
    // Mock form state
    const [businessName, setBusinessName] = useState('');
    const [cacNumber, setCacNumber] = useState('');
    const [docUploaded, setDocUploaded] = useState(false);

    const handleUpload = () => {
        // Mock file upload
        setTimeout(() => setDocUploaded(true), 1000);
    };

    const handleSubmit = () => {
        Alert.alert('Application Submitted', 'Your application is pending admin review. You will be notified once approved.', [
            { text: 'OK', onPress: () => router.push('/') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Partner Onboarding</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.progressRow}>
                    <View style={[styles.progressDot, step >= 1 && styles.activeDot]} />
                    <View style={[styles.progressLine, step >= 2 && styles.activeLine]} />
                    <View style={[styles.progressDot, step >= 2 && styles.activeDot]} />
                </View>

                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Business Details</Text>
                        <Text style={styles.stepDesc}>Enter your workshop or towing business details.</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Business Name</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="Lagos Auto Fix" 
                                placeholderTextColor={COLORS.textMuted}
                                value={businessName}
                                onChangeText={setBusinessName}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Service Radius (km)</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="20" 
                                placeholderTextColor={COLORS.textMuted}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Primary Category</Text>
                            <View style={styles.fakeSelect}>
                                <Text style={styles.fakeSelectText}>General Mechanic</Text>
                                <MaterialCommunityIcons name="chevron-down" size={20} color={COLORS.textSecondary} />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.btn} onPress={() => setStep(2)}>
                            <Text style={styles.btnText}>Next Step</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>KYC Verification</Text>
                        <Text style={styles.stepDesc}>Upload your CAC registration and valid ID for verification.</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CAC Registration Number</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="RC1234567" 
                                placeholderTextColor={COLORS.textMuted}
                                value={cacNumber}
                                onChangeText={setCacNumber}
                            />
                        </View>

                        <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
                            <MaterialCommunityIcons 
                                name={docUploaded ? "check-circle" : "cloud-upload"} 
                                size={40} 
                                color={docUploaded ? COLORS.green : COLORS.primary} 
                            />
                            <Text style={styles.uploadText}>
                                {docUploaded ? 'Documents Uploaded' : 'Tap to upload CAC Document'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.btn, !docUploaded && { opacity: 0.5 }]} 
                            onPress={handleSubmit}
                            disabled={!docUploaded}
                        >
                            <Text style={styles.btnText}>Submit Application</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    content: { padding: 20 },
    progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
    progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.surfaceAccent },
    activeDot: { backgroundColor: COLORS.primary },
    progressLine: { width: 100, height: 2, backgroundColor: COLORS.surfaceAccent },
    activeLine: { backgroundColor: COLORS.primary },
    stepContainer: { gap: 20 },
    stepTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800' },
    stepDesc: { color: COLORS.textSecondary, fontSize: 14, marginTop: -10 },
    inputGroup: { gap: 8 },
    label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
    input: { backgroundColor: COLORS.surfaceAccent, borderRadius: 12, padding: 16, color: COLORS.textPrimary, fontSize: 16, borderWidth: 1, borderColor: COLORS.border },
    fakeSelect: { backgroundColor: COLORS.surfaceAccent, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    fakeSelectText: { color: COLORS.textPrimary, fontSize: 16 },
    uploadBox: { backgroundColor: COLORS.surfaceAccent, borderRadius: 16, padding: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', gap: 10, marginTop: 10 },
    uploadText: { color: COLORS.textPrimary, fontWeight: '600' },
    btn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
