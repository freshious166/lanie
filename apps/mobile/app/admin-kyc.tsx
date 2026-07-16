import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/data';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOCK_QUEUE = [
    { id: 'V-102', name: 'Lekki Towing Services', type: 'TOWING', submittedAt: '2 hours ago', status: 'PENDING' },
    { id: 'V-103', name: 'Mike Auto Repairs', type: 'GENERAL_MECHANIC', submittedAt: '5 hours ago', status: 'PENDING' },
];

export default function AdminKycScreen() {
    const router = useRouter();
    const [queue, setQueue] = useState(MOCK_QUEUE);

    const handleVerify = (id: string) => {
        Alert.alert('Verify Partner', 'Approve this partner to appear on the marketplace?', [
            { text: 'Reject', style: 'destructive', onPress: () => setQueue(queue.filter(q => q.id !== id)) },
            { text: 'Approve', onPress: () => {
                setQueue(queue.filter(q => q.id !== id));
                Alert.alert('Success', 'Partner verified and active.');
            }}
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.partnerName}>{item.name}</Text>
                    <Text style={styles.partnerType}>{item.type.replace('_', ' ')}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
            </View>
            
            <View style={styles.docsGrid}>
                <View style={styles.docBox}>
                    <MaterialCommunityIcons name="file-document-outline" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.docLabel}>CAC.pdf</Text>
                </View>
                <View style={styles.docBox}>
                    <MaterialCommunityIcons name="card-account-details-outline" size={24} color={COLORS.textSecondary} />
                    <Text style={styles.docLabel}>IDCard.jpg</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={() => handleVerify(item.id)}>
                <Text style={styles.btnText}>Review Documents</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>KYC Queue</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={queue}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <MaterialCommunityIcons name="check-circle-outline" size={48} color={COLORS.green} />
                        <Text style={styles.emptyText}>All caught up! No pending verifications.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    list: { padding: 16, gap: 16 },
    card: { backgroundColor: COLORS.surfaceAccent, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    partnerName: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '800' },
    partnerType: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
    badge: { backgroundColor: 'rgba(245, 158, 11, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { color: COLORS.amber, fontSize: 10, fontWeight: '800' },
    docsGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    docBox: { flex: 1, backgroundColor: COLORS.background, padding: 12, borderRadius: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border },
    docLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600' },
    btn: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    empty: { alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
    emptyText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' }
});
