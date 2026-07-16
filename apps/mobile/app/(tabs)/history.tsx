import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_VEHICLES, MOCK_HISTORY, COLORS, HistoryEvent } from '../../constants/data';

const TYPE_COLORS: Record<string, string> = {
    maintenance: COLORS.green,
    accident: COLORS.red,
    log: COLORS.primary,
    ownership: COLORS.textSecondary,
};

const TYPE_EMOJIS: Record<string, string> = {
    maintenance: '🔧',
    accident: '⚠️',
    log: '📊',
    ownership: '👤',
};

const FILTERS = ['All Events', 'Maintenance', 'Accidents', 'Ownership'];

export default function HistoryScreen() {
    const vehicle = MOCK_VEHICLES[0];

    const renderEvent = ({ item }: { item: HistoryEvent }) => (
        <View style={styles.timelineItem}>
            <View style={[styles.dot, { borderColor: TYPE_COLORS[item.type] }]}>
                <Text style={styles.dotEmoji}>{TYPE_EMOJIS[item.type]}</Text>
            </View>
            <View style={[styles.eventCard, { borderLeftColor: TYPE_COLORS[item.type] }]}>
                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <Text style={styles.eventDate}>{item.date}</Text>
                </View>
                <Text style={[styles.eventDesc, item.type === 'accident' && { color: '#f87171' }]}>
                    {item.description}
                </Text>
                <View style={styles.eventFooter}>
                    <Text style={styles.eventMileage}>{item.mileage}</Text>
                    {item.isVerified && <Text style={styles.verifiedBadge}>✅ Verified Record</Text>}
                    {item.details && <Text style={styles.detailsLink}>{item.details} ›</Text>}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Vehicle History</Text>
                <Text style={styles.shareIcon}>📤</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Vehicle Card */}
                <View style={styles.vehicleCard}>
                    <Image source={{ uri: vehicle.imageUrl }} style={styles.vehicleImage} />
                    <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleName}>{vehicle.name} ✅</Text>
                        <Text style={styles.vehicleVin}>VIN: {vehicle.vin}</Text>
                        <View style={styles.tags}>
                            {['White', 'Sedan', 'Auto'].map((t) => (
                                <Text key={t} style={styles.tag}>{t}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {[
                        { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
                        { label: 'Next Svc', value: `${vehicle.nextServiceMileage / 1000}k mi` },
                        { label: 'Value', value: vehicle.value },
                    ].map((s) => (
                        <View key={s.label} style={styles.statBox}>
                            <Text style={styles.statLabel}>{s.label}</Text>
                            <Text style={styles.statValue}>{s.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {FILTERS.map((f, i) => (
                        <View key={f} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
                            <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Timeline */}
                <View style={styles.timelineContainer}>
                    <Text style={styles.timelineTitle}>Service Timeline</Text>
                    <View style={styles.verticalLine} />
                    {MOCK_HISTORY.map((event) => (
                        <View key={event.id}>
                            {renderEvent({ item: event })}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabIcon}>＋</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 18 },
    shareIcon: { fontSize: 22 },
    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    vehicleImage: { width: 88, height: 88, borderRadius: 14, resizeMode: 'cover' },
    vehicleInfo: { flex: 1 },
    vehicleName: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    vehicleVin: { color: COLORS.textSecondary, fontSize: 11, fontFamily: 'monospace', marginTop: 4 },
    tags: { flexDirection: 'row', gap: 6, marginTop: 8 },
    tag: {
        backgroundColor: COLORS.surfaceAccent,
        color: COLORS.textSecondary,
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 8 },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statLabel: { color: COLORS.textSecondary, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
    statValue: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 16, marginTop: 4 },
    filterRow: { paddingHorizontal: 16, marginVertical: 8 },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceAccent,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 13 },
    filterTextActive: { color: '#fff' },
    timelineContainer: { paddingHorizontal: 16, paddingBottom: 100, position: 'relative' },
    timelineTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 17, marginBottom: 20 },
    verticalLine: {
        position: 'absolute',
        left: 38,
        top: 56,
        bottom: 100,
        width: 2,
        backgroundColor: COLORS.surfaceAccent,
    },
    timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 12 },
    dot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        backgroundColor: COLORS.surfaceAccent,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    dotEmoji: { fontSize: 18 },
    eventCard: {
        flex: 1,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 14,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    eventTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 14, flex: 1 },
    eventDate: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
    eventDesc: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 18 },
    eventFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8, flexWrap: 'wrap' },
    eventMileage: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' },
    verifiedBadge: { color: COLORS.green, fontSize: 10, fontWeight: '700' },
    detailsLink: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
    fab: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 8,
    },
    fabIcon: { color: '#fff', fontSize: 28, fontWeight: '700' },
});
