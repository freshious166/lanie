import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_JOBS = [
    { id: 'JOB-001', customer: 'Ahmed Musa', vehicle: 'Toyota Hilux', status: 'REQUESTED', distance: '3.2 km', issue: 'Flat Tire' },
    { id: 'JOB-002', customer: 'Sarah John', vehicle: 'Honda Civic', status: 'IN_PROGRESS', distance: '1.1 km', issue: 'Engine Overheating' },
    { id: 'JOB-003', customer: 'Lagos Fleet Ops', vehicle: 'Ford Transit', status: 'COMPLETED', distance: '5.0 km', issue: 'Regular Maintenance' },
];

export default function PartnerJobsScreen() {
    const router = useRouter();
    const [jobs, setJobs] = useState(MOCK_JOBS);

    const handleAction = (id: string, currentStatus: string) => {
        if (currentStatus === 'REQUESTED') {
            Alert.alert('Submit Quote', 'Are you sure you want to quote this job for N15,000?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: () => {
                    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'QUOTED' } : j));
                }}
            ]);
        } else if (currentStatus === 'IN_PROGRESS') {
            Alert.alert('Complete Job', 'Mark job as completed and generate invoice?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', onPress: () => {
                    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'COMPLETED' } : j));
                }}
            ]);
        }
    };

    const renderJob = ({ item }: { item: any }) => (
        <View style={styles.jobCard}>
            <View style={styles.jobHeader}>
                <Text style={styles.jobId}>{item.id}</Text>
                <View style={[styles.statusBadge, item.status === 'COMPLETED' && styles.statusBadgeCompleted, item.status === 'REQUESTED' && styles.statusBadgeRequested]}>
                    <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
                </View>
            </View>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.vehicleInfo}>{item.vehicle} • {item.distance}</Text>
            
            <View style={styles.issueBox}>
                <MaterialCommunityIcons name="alert-circle" size={16} color={COLORS.amber} />
                <Text style={styles.issueText}>{item.issue}</Text>
            </View>

            {item.status !== 'COMPLETED' && item.status !== 'QUOTED' && (
                <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => handleAction(item.id, item.status)}
                >
                    <Text style={styles.actionBtnText}>
                        {item.status === 'REQUESTED' ? 'Submit Quote' : 'Mark Completed'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Management</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>3</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>₦45k</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Done</Text>
                </View>
            </View>

            <FlatList
                data={jobs}
                keyExtractor={item => item.id}
                renderItem={renderJob}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 20 },
    statBox: { flex: 1, backgroundColor: COLORS.surfaceAccent, padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    statValue: { color: COLORS.primary, fontSize: 20, fontWeight: '800' },
    statLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4, fontWeight: '600' },
    list: { padding: 16, gap: 16 },
    jobCard: { backgroundColor: COLORS.surfaceAccent, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
    jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    jobId: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700' },
    statusBadge: { backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusBadgeCompleted: { backgroundColor: 'rgba(34, 197, 94, 0.2)' },
    statusBadgeRequested: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
    statusText: { color: COLORS.textPrimary, fontSize: 10, fontWeight: '800' },
    customerName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    vehicleInfo: { color: COLORS.textSecondary, fontSize: 14, marginTop: 2 },
    issueBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 10, borderRadius: 8, marginTop: 12, gap: 8 },
    issueText: { color: COLORS.amber, fontSize: 13, fontWeight: '600' },
    actionBtn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
    actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
