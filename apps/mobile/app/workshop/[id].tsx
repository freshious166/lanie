import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_WORKSHOPS, COLORS } from '../../constants/data';

const TABS = ['Services', 'Reviews', 'About'];

export default function WorkshopDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Services');

    const workshop = MOCK_WORKSHOPS.find((w) => w.id === id) || MOCK_WORKSHOPS[0];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Hero image */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: workshop.imageUrl }} style={styles.heroImage} />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.workshopName}>{workshop.name} ✅</Text>
                        <Text style={styles.workshopMeta}>
                            📍 {workshop.address}  •  ⭐ {workshop.rating} ({workshop.reviewCount} reviews)
                        </Text>
                    </View>
                </View>

                {/* Verified badge */}
                <View style={styles.verifiedBanner}>
                    <Text style={styles.verifiedIcon}>🛡️</Text>
                    <View>
                        <Text style={styles.verifiedTitle}>Lainefleet Verified</Text>
                        <Text style={styles.verifiedSub}>Background checked and guaranteed</Text>
                    </View>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabBar}>
                    {TABS.map((t) => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setActiveTab(t)}
                            style={[styles.tabItem, activeTab === t && styles.tabItemActive]}
                        >
                            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Services */}
                {activeTab === 'Services' && (
                    <View>
                        <Text style={styles.sectionTitle}>Available Services</Text>
                        {workshop.services.length === 0 ? (
                            <Text style={styles.emptyText}>No services listed.</Text>
                        ) : (
                            workshop.services.map((s) => (
                                <TouchableOpacity key={s.id} style={styles.serviceRow}>
                                    <View style={styles.serviceIconBox}>
                                        <Text style={styles.serviceEmoji}>🔧</Text>
                                    </View>
                                    <View style={styles.serviceInfo}>
                                        <Text style={styles.serviceName}>{s.name}</Text>
                                        <Text style={styles.serviceDuration}>{s.duration}</Text>
                                    </View>
                                    <View style={styles.servicePriceCol}>
                                        <Text style={styles.servicePrice}>{s.price}</Text>
                                        <Text style={styles.chevron}>›</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}

                {/* Reviews */}
                {activeTab === 'Reviews' && (
                    <View style={styles.reviewsContainer}>
                        <View style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>JD</Text>
                                </View>
                                <Text style={styles.reviewerName}>John Doe</Text>
                                <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <Text style={styles.reviewText}>
                                "Great service! They were very professional and finished faster than expected."
                            </Text>
                        </View>
                    </View>
                )}

                {/* About */}
                {activeTab === 'About' && (
                    <View style={styles.aboutContainer}>
                        <Text style={styles.aboutDesc}>{workshop.description}</Text>
                        <View style={styles.mapPlaceholder}>
                            <Text style={styles.mapIcon}>📍</Text>
                            <Text style={styles.mapAddress}>{workshop.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoItem}>🕒 {workshop.hours}</Text>
                            <Text style={styles.infoItem}>📏 {workshop.distance} away</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.chatBtn}
                    onPress={() => Alert.alert('💬', 'Chat feature coming soon!')}
                >
                    <Text style={styles.chatBtnIcon}>💬</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => Alert.alert('✅ Booked!', `Your booking at ${workshop.name} has been confirmed.`)}
                >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    heroContainer: { height: 240, position: 'relative' },
    heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    heroOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    workshopName: { color: '#fff', fontWeight: '700', fontSize: 24 },
    workshopMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
    verifiedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        margin: 16,
        backgroundColor: `${COLORS.primary}22`,
        borderWidth: 1,
        borderColor: `${COLORS.primary}44`,
        borderRadius: 14,
        padding: 14,
    },
    verifiedIcon: { fontSize: 24 },
    verifiedTitle: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 15 },
    verifiedSub: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
    infoIcon: { marginLeft: 'auto', fontSize: 20 },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        marginHorizontal: 16,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabItemActive: { borderBottomColor: COLORS.primary },
    tabText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 14 },
    tabTextActive: { color: COLORS.textPrimary },
    sectionTitle: {
        color: COLORS.textPrimary,
        fontWeight: '700',
        fontSize: 17,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    emptyText: { color: COLORS.textSecondary, textAlign: 'center', padding: 32 },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: 12,
    },
    serviceIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceAccent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serviceEmoji: { fontSize: 22 },
    serviceInfo: { flex: 1 },
    serviceName: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 15 },
    serviceDuration: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
    servicePriceCol: { alignItems: 'flex-end' },
    servicePrice: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },
    chevron: { color: COLORS.textSecondary, fontSize: 18 },
    reviewsContainer: { padding: 16 },
    reviewCard: { backgroundColor: COLORS.surfaceAccent, borderRadius: 14, padding: 16 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },
    reviewerName: { color: COLORS.textPrimary, fontWeight: '600', flex: 1 },
    stars: { fontSize: 12 },
    reviewText: { color: COLORS.textSecondary, fontStyle: 'italic', fontSize: 13, lineHeight: 20 },
    aboutContainer: { padding: 16, gap: 14 },
    aboutDesc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22 },
    mapPlaceholder: {
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 14,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    mapIcon: { fontSize: 40 },
    mapAddress: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center' },
    infoRow: { flexDirection: 'row', gap: 16 },
    infoItem: { color: COLORS.textSecondary, fontSize: 13 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        paddingBottom: 28,
        backgroundColor: `${COLORS.background}EE`,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    chatBtn: {
        width: 54,
        height: 54,
        borderRadius: 14,
        backgroundColor: COLORS.surfaceAccent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatBtnIcon: { fontSize: 24 },
    bookBtn: {
        flex: 1,
        height: 54,
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
