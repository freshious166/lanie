import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOffline } from '../../hooks/useOffline';
import { MOCK_VEHICLES, COLORS, Vehicle } from '../../constants/data';

const STATUS_FILTERS = ['All', 'Healthy', 'Needs Attention', 'Warning'];

const STATUS_DOT_COLOR: Record<string, string> = {
    Healthy: COLORS.green,
    'Needs Attention': COLORS.amber,
    Warning: COLORS.red,
};

export default function GarageScreen() {
    const router = useRouter();
    const { saveData, getData } = useOffline();
    
    const [vehicles, setVehicles] = React.useState<Vehicle[]>(MOCK_VEHICLES);
    const [activeStatusFilter, setActiveStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeVehicleId, setActiveVehicleId] = useState(MOCK_VEHICLES[0].id);
    const [vinInput, setVinInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    React.useEffect(() => {
        const initData = async () => {
            const cached = await getData<Vehicle[]>('cached_vehicles');
            if (cached) {
                setVehicles(cached);
            } else {
                // If no cache, use mock and save it
                await saveData('cached_vehicles', MOCK_VEHICLES);
            }
        };
        initData();
    }, []);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                v.name.toLowerCase().includes(q) ||
                v.model.toLowerCase().includes(q) ||
                v.licensePlate.toLowerCase().includes(q);
            const matchesStatus = activeStatusFilter === 'All' || v.status === activeStatusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [vehicles, searchQuery, activeStatusFilter]);

    const activeVehicle = useMemo(
        () => vehicles.find((v) => v.id === activeVehicleId) || vehicles[0],
        [vehicles, activeVehicleId]
    );

    const handleVerifyVIN = async () => {
        const vin = vinInput.trim().toUpperCase();
        if (vin.length !== 17) {
            Alert.alert('Invalid VIN', 'VIN must be exactly 17 characters.');
            return;
        }
        setIsVerifying(true);
        // Simulate VIN lookup
        await new Promise((r) => setTimeout(r, 1500));
        setIsVerifying(false);
        Alert.alert('VIN Verified', `VIN ${vin} looks valid! Details would appear here.`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                        <Text style={styles.headerIcon}>👤</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Personal Garage</Text>
                    <Text style={styles.headerIcon}>🔔</Text>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name, model or plate..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Vehicle Carousel */}
                <FlatList
                    data={filteredVehicles}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.carouselContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setActiveVehicleId(item.id)}
                            style={[styles.vehicleCard, activeVehicleId === item.id && styles.vehicleCardActive]}
                        >
                            <Image source={{ uri: item.imageUrl }} style={styles.vehicleImage} />
                            <Text style={styles.vehicleName}>{item.name}</Text>
                            <Text style={styles.vehicleSub}>{item.model} • {item.licensePlate}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyCard}>
                            <Text style={styles.emptyText}>No vehicles match your search.</Text>
                        </View>
                    }
                />

                {/* Status Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {STATUS_FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setActiveStatusFilter(f)}
                            style={[styles.filterChip, activeStatusFilter === f && styles.filterChipActive]}
                        >
                            {f !== 'All' && (
                                <View style={[styles.statusDot, { backgroundColor: STATUS_DOT_COLOR[f] }]} />
                            )}
                            <Text style={[styles.filterText, activeStatusFilter === f && styles.filterTextActive]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Active Vehicle Specs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Vehicle Specifications</Text>
                    <View style={styles.specsRow}>
                        {[
                            { label: 'Mileage', value: `${activeVehicle.mileage.toLocaleString()} mi` },
                            { label: 'Next Svc', value: `${activeVehicle.nextServiceMileage.toLocaleString()} mi` },
                            { label: 'Value', value: activeVehicle.value },
                        ].map((stat) => (
                            <View key={stat.label} style={styles.statBox}>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={styles.statValue}>{stat.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* VIN Verification */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔎 VIN Verification</Text>
                    <View style={styles.vinRow}>
                        <TextInput
                            style={styles.vinInput}
                            placeholder="Enter 17-digit VIN"
                            placeholderTextColor={COLORS.textMuted}
                            maxLength={17}
                            autoCapitalize="characters"
                            value={vinInput}
                            onChangeText={(t) => setVinInput(t.toUpperCase())}
                        />
                        <Text style={styles.vinCount}>{vinInput.length}/17</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
                        onPress={handleVerifyVIN}
                        disabled={isVerifying}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.verifyBtnText}>✅ Verify Now</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Status Cards */}
                <Text style={styles.listTitle}>Vehicle Status</Text>
                <View style={styles.statusCard}>
                    <View style={styles.statusCardContent}>
                        <Text style={styles.statusBadge}>🔧 Maintenance</Text>
                        <Text style={styles.statusCardTitle}>
                            Next Service in {Math.max(0, activeVehicle.nextServiceMileage - activeVehicle.mileage)} mi
                        </Text>
                        <Text style={styles.statusCardSub}>Oil change and brake inspection</Text>
                        <TouchableOpacity style={styles.actionBtn}>
                            <Text style={styles.actionBtnText}>📅 Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.statusCard, { marginBottom: 100 }]}>
                    <View style={styles.statusCardContent}>
                        <Text style={[styles.statusBadge, { color: COLORS.amber }]}>⚠️ Urgent</Text>
                        <Text style={styles.statusCardTitle}>Insurance Expires in 30 days</Text>
                        <Text style={styles.statusCardSub}>Policy #LN-99283</Text>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}>
                            <Text style={styles.actionBtnText}>🔄 Renew</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerIcon: { fontSize: 24 },
    headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: 12,
    },
    searchIcon: { fontSize: 18, marginRight: 8 },
    searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
    carouselContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 12 },
    vehicleCard: {
        width: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
        opacity: 0.65,
    },
    vehicleCardActive: { opacity: 1, borderWidth: 2, borderColor: COLORS.primary },
    vehicleImage: { width: '100%', height: 130, resizeMode: 'cover' },
    vehicleName: {
        color: COLORS.textPrimary,
        fontSize: 15,
        fontWeight: '700',
        paddingHorizontal: 10,
        paddingTop: 8,
    },
    vehicleSub: { color: COLORS.textSecondary, fontSize: 12, paddingHorizontal: 10, paddingBottom: 10 },
    emptyCard: { padding: 32, alignItems: 'center' },
    emptyText: { color: COLORS.textSecondary },
    filterRow: { paddingHorizontal: 16, marginVertical: 12 },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        marginRight: 8,
        gap: 6,
    },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 13 },
    filterTextActive: { color: '#fff' },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    section: {
        marginHorizontal: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 12 },
    specsRow: { flexDirection: 'row', gap: 8 },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    statLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    statValue: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 13, marginTop: 4 },
    vinRow: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    vinInput: {
        flex: 1,
        backgroundColor: COLORS.surfaceAccent,
        color: COLORS.textPrimary,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontFamily: 'monospace',
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 14,
    },
    vinCount: {
        position: 'absolute',
        right: 12,
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: '700',
    },
    verifyBtn: {
        marginTop: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyBtnDisabled: { backgroundColor: COLORS.surfaceAccent },
    verifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    listTitle: {
        color: COLORS.textPrimary,
        fontSize: 17,
        fontWeight: '700',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    statusCard: {
        marginHorizontal: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    statusCardContent: { gap: 4 },
    statusBadge: { color: COLORS.primary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    statusCardTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
    statusCardSub: { color: COLORS.textSecondary, fontSize: 13 },
    actionBtn: {
        marginTop: 10,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: 'flex-start',
    },
    actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
