import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useOffline } from '../../hooks/useOffline';
import { MOCK_WORKSHOPS, COLORS, Workshop } from '../../constants/data';

const { width, height } = Dimensions.get('window');
const FILTERS = ['Verified', 'Open Now', 'Towing', 'Body Shop', 'Top Rated'];

// Fallback region — Nigeria's geographic center, shown when GPS permission is denied
const FALLBACK_REGION = {
    latitude: 9.0820,
    longitude: 8.6753,
    latitudeDelta: 8.0,
    longitudeDelta: 8.0,
};

// OpenStreetMap tile URL — 100% free, no API key needed
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

export default function ExploreScreen() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const { saveData, getData } = useOffline();

    const [workshops, setWorkshops] = useState<Workshop[]>(MOCK_WORKSHOPS);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Verified');
    const [isSheetOpen, setIsSheetOpen] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    // mapReady = false means we haven't got location yet — map is NOT rendered
    const [mapReady, setMapReady] = useState(false);
    const [isLocating, setIsLocating] = useState(true);
    const [userRegion, setUserRegion] = useState<Region>(FALLBACK_REGION);
    const [cityName, setCityName] = useState<string>('Nigeria');

    const sheetY = useSharedValue(0);

    useEffect(() => {
        // Load cached workshop data
        const initData = async () => {
            const cached = await getData<Workshop[]>('cached_workshops');
            if (cached) {
                setWorkshops(cached);
            } else {
                await saveData('cached_workshops', MOCK_WORKSHOPS);
            }
        };
        initData();

        // Get real user location, then render map at that exact spot
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Location permission denied — showing Lagos.');
                    setMapReady(true); // render map at fallback region
                    setIsLocating(false);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                const { latitude, longitude } = location.coords;

                // Set the region state — map will render with this as initialRegion
                setUserRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });

                // Free reverse-geocode via Nominatim (OpenStreetMap) for city label
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                        { headers: { 'User-Agent': 'LaineFleet-App/1.0' } }
                    );
                    const json = await res.json();
                    const city =
                        json.address?.city ||
                        json.address?.town ||
                        json.address?.suburb ||
                        json.address?.state_district ||
                        'your area';
                    setCityName(city);
                } catch {
                    // silently ignore geocode failure — city stays 'your area'
                }
            } catch (e) {
                setErrorMsg('Could not get location.');
            } finally {
                setMapReady(true);
                setIsLocating(false);
            }
        })();
    }, []);

    const toggleSheet = () => {
        setIsSheetOpen(!isSheetOpen);
        sheetY.value = withSpring(isSheetOpen ? height * 0.45 : 0, {
            damping: 15,
            stiffness: 90,
        });
    };

    const filtered = workshops.filter((w) =>
        w.name.toLowerCase().includes(search.toLowerCase())
    );

    const animatedSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sheetY.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Map only renders after real GPS location is fetched — no jump to wrong coords */}
            {mapReady && (
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_DEFAULT}
                    style={StyleSheet.absoluteFill}
                    initialRegion={userRegion}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    mapType={Platform.OS === 'android' ? 'none' : 'mutedStandard'}
                >
                    {/* Free OpenStreetMap tiles (Android) */}
                    {Platform.OS === 'android' && (
                        <UrlTile
                            urlTemplate={OSM_TILE_URL}
                            maximumZ={19}
                            flipY={false}
                            tileSize={256}
                        />
                    )}

                    {workshops.map((workshop) => (
                        <Marker
                            key={workshop.id}
                            coordinate={{
                                latitude: workshop.latitude,
                                longitude: workshop.longitude,
                            }}
                            onPress={() => router.push(`/workshop/${workshop.id}`)}
                        >
                            <View style={styles.markerContainer}>
                                <View style={styles.markerInner}>
                                    <MaterialCommunityIcons name="wrench" size={14} color="#fff" />
                                </View>
                                <View style={styles.markerPointer} />
                            </View>
                        </Marker>
                    ))}
                </MapView>
            )}

            {/* Floating Top UI */}
            <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
                <BlurView intensity={20} tint="dark" style={styles.floatingSearch}>
                    <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search mechanics in ${cityName}...`}
                        placeholderTextColor={COLORS.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <TouchableOpacity style={styles.filterBtn}>
                        <MaterialCommunityIcons name="tune-variant" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                </BlurView>

                <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterRow}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setActiveFilter(f)}
                            style={[
                                styles.filterChip,
                                activeFilter === f && styles.filterChipActive,
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === f && styles.filterTextActive,
                            ]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.ScrollView>
            </SafeAreaView>

            {/* OSM Attribution (required by OSM license) */}
            <View style={styles.attribution}>
                <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
            </View>

            {/* My Location FAB */}
            <TouchableOpacity
                style={styles.myLocationBtn}
                onPress={async () => {
                    let location = await Location.getCurrentPositionAsync({});
                    mapRef.current?.animateToRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }}
            >
                <MaterialCommunityIcons name="crosshairs-gps" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Bottom Sheet */}
            <Animated.View style={[styles.sheetContainer, animatedSheetStyle]}>
                <View style={styles.sheet}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={toggleSheet}
                        style={styles.dragHandleContainer}
                    >
                        <View style={styles.dragHandle} />
                    </TouchableOpacity>
                    <View style={styles.sheetHeader}>
                        <View>
                            <Text style={styles.sheetTitle}>Nearest Workshops</Text>
                            <Text style={styles.sheetSub}>
                                {filtered.length} workshops found near {cityName}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.mapToggle}
                            onPress={toggleSheet}
                        >
                            <MaterialCommunityIcons
                                name={isSheetOpen ? 'chevron-down' : 'chevron-up'}
                                size={24}
                                color={COLORS.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.workshopCard}
                                onPress={() => router.push(`/workshop/${item.id}`)}
                            >
                                <Image source={{ uri: item.imageUrl }} style={styles.workshopImage} />
                                <View style={styles.workshopInfo}>
                                    <View style={styles.workshopRow}>
                                        <Text style={styles.workshopName} numberOfLines={1}>{item.name}</Text>
                                        <View style={styles.ratingBadge}>
                                            <MaterialCommunityIcons name="star" size={12} color={COLORS.amber} />
                                            <Text style={styles.ratingText}>{item.rating}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.workshopAddress} numberOfLines={1}>
                                        {item.address}
                                    </Text>

                                    <View style={styles.workshopMeta}>
                                        <View style={styles.statusBadge}>
                                            <View style={styles.statusDot} />
                                            <Text style={styles.statusText}>Open</Text>
                                        </View>
                                        <Text style={styles.workshopDist}>• {item.distance}</Text>
                                    </View>
                                </View>
                                <View style={styles.chevron}>
                                    <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.textMuted} />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Animated.View>

            {/* Full-screen loading spinner until GPS location is ready */}
            {isLocating && (
                <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>📍 Getting your location...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    loadingOverlay: {
        backgroundColor: 'rgba(13, 17, 23, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    loadingText: {
        color: COLORS.textPrimary,
        marginTop: 12,
        fontWeight: '600',
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    floatingSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 56,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(22, 28, 38, 0.85)',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, color: COLORS.textPrimary, fontSize: 16 },
    filterBtn: { padding: 5 },
    filterRow: { marginTop: 15 },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(22, 28, 38, 0.9)',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    filterText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 13 },
    filterTextActive: { color: '#fff' },
    attribution: {
        position: 'absolute',
        bottom: height * 0.65 + 4,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 5,
    },
    attributionText: { color: '#fff', fontSize: 9 },
    myLocationBtn: {
        position: 'absolute',
        bottom: height * 0.6 + 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        zIndex: 5,
    },
    sheetContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.65,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '100%',
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dragHandleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: COLORS.textMuted,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    sheetTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
    sheetSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
    mapToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceAccent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: { paddingHorizontal: 20, paddingBottom: 60 },
    workshopCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 24,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    workshopImage: { width: 80, height: 80, borderRadius: 18, resizeMode: 'cover' },
    workshopInfo: { flex: 1, marginLeft: 14, gap: 4 },
    workshopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    workshopName: { color: COLORS.textPrimary, fontWeight: '800', fontSize: 16, flex: 1, marginRight: 8 },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 4,
    },
    ratingText: { color: COLORS.amber, fontSize: 12, fontWeight: '800' },
    workshopAddress: { color: COLORS.textSecondary, fontSize: 13 },
    workshopMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 6,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
    statusText: { color: COLORS.green, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
    workshopDist: { color: COLORS.textSecondary, fontSize: 12, marginLeft: 8 },
    chevron: { marginLeft: 10 },
    markerContainer: {
        alignItems: 'center',
    },
    markerInner: {
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    markerPointer: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 0,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff',
        marginTop: -1,
    },
});
