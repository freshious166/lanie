import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/data';
import { syncManager } from '../../services/syncManager';
import { useOffline } from '../../hooks/useOffline';

const { width } = Dimensions.get('window');

const ISSUES = [
    { id: 'tire', label: 'Flat Tire', sub: 'Replace or repair', emoji: '🛞' },
    { id: 'battery', label: 'Dead Battery', sub: 'Needs jumpstart', emoji: '🔋' },
    { id: 'engine', label: 'Engine Issue', sub: 'Mechanical failure', emoji: '🚗' },
    { id: 'fuel', label: 'Out of Fuel', sub: 'Gas delivery', emoji: '⛽' },
];

// Nigeria geographic center — used as fallback when GPS is unavailable
const NIGERIA_CENTER = { lat: 9.0820, lng: 8.6753 };

// Builds a standalone Leaflet HTML page using OpenStreetMap tiles (100% free)
function buildLeafletHTML(lat: number, lng: number, address: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #161C26; }
    #map { width: 100%; height: 100%; }
    .leaflet-container { background: #161C26; }
    .custom-pin {
      width: 34px; height: 34px; border-radius: 50% 50% 50% 0;
      background: #EF4444; transform: rotate(-45deg);
      border: 3px solid #fff;
      box-shadow: 0 4px 14px rgba(239,68,68,0.6);
    }
    .pulse {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(239,68,68,0.25);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%  { transform: translate(-50%,-50%) scale(0.6); opacity:1; }
      100%{ transform: translate(-50%,-50%) scale(2.2); opacity:0; }
    }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', { zoomControl: false, attributionControl: true })
             .setView([${lat}, ${lng}], ${lat === 9.0820 ? 6 : 16});

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Custom red SOS marker
  var sosIcon = L.divIcon({
    className: '',
    html: '<div class="pulse"></div><div class="custom-pin"></div>',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -38],
  });

  L.marker([${lat}, ${lng}], { icon: sosIcon })
   .addTo(map)
   .bindPopup('<b>📍 Your Location</b><br/>${address}', { maxWidth: 220 })
   .openPopup();
</script>
</body>
</html>`;
}

export default function EmergencyScreen() {
    const [serviceType, setServiceType] = useState<'Towing' | 'Roadside Repair'>('Towing');
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState('Detecting location...');
    const [locationLoading, setLocationLoading] = useState(true);
    const { isOffline } = useOffline();

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    // Fall back to Nigeria center so map still renders
                    setCoords(NIGERIA_CENTER);
                    setAddress('Nigeria (location permission denied)');
                    setLocationLoading(false);
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const { latitude, longitude } = loc.coords;
                setCoords({ lat: latitude, lng: longitude });

                // Reverse geocode using free Nominatim (OpenStreetMap)
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                    { headers: { 'User-Agent': 'LaineFleet-App/1.0' } }
                );
                const json = await response.json();
                const road = json.address?.road || json.address?.suburb || '';
                const city = json.address?.city || json.address?.state_district || '';
                setAddress(road ? `${road}, ${city}` : json.display_name?.split(',').slice(0, 2).join(',') || 'Unknown Location');
            } catch {
                setAddress('Could not determine location');
            } finally {
                setLocationLoading(false);
            }
        })();
    }, []);

    const handleRequestHelp = async () => {
        if (!selectedIssue) {
            Alert.alert('Select Issue', 'Please select the type of issue you are facing.');
            return;
        }

        try {
            await syncManager.enqueueTask({
                type: 'BREAKDOWN_REPORT',
                payload: {
                    serviceType,
                    issue: selectedIssue,
                    notes,
                    location: coords,
                    address,
                }
            });

            if (isOffline) {
                Alert.alert('📶 Saved Offline', 'You are currently offline. Your breakdown request has been saved and will be sent automatically once connectivity returns.');
            } else {
                Alert.alert('🆘 Help Requested', 'A responder has been notified and is on the way!');
            }
            
            // Reset form
            setSelectedIssue(null);
            setNotes('');
        } catch (error) {
            Alert.alert('Error', 'Failed to save request. Please try again.');
        }
    };

    const mapHTML = coords
        ? buildLeafletHTML(coords.lat, coords.lng, address.replace(/'/g, "\\'"))
        : null;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Emergency Assistance</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Live OpenStreetMap via Leaflet in WebView */}
                <View style={styles.mapContainer}>
                    {locationLoading ? (
                        <View style={styles.mapLoading}>
                            <ActivityIndicator color={COLORS.primary} size="large" />
                            <Text style={styles.mapLoadingText}>Detecting your location...</Text>
                        </View>
                    ) : mapHTML ? (
                        <WebView
                            source={{ html: mapHTML }}
                            style={styles.map}
                            scrollEnabled={false}
                            javaScriptEnabled
                            originWhitelist={['*']}
                            onError={() => setAddress('Map failed to load')}
                        />
                    ) : (
                        <View style={styles.mapLoading}>
                            <Text style={styles.mapText}>📍</Text>
                            <Text style={styles.mapErrorText}>Location unavailable</Text>
                        </View>
                    )}

                    {/* Overlay chip showing detected address */}
                    <View style={styles.locationChip}>
                        <Text style={styles.locationLabel}>📍  DETECTED LOCATION</Text>
                        <Text style={styles.locationValue} numberOfLines={1}>{address}</Text>
                    </View>

                    {/* SOS overlay badge */}
                    <View style={styles.sosBadge}>
                        <Text style={styles.sosText}>LIVE</Text>
                    </View>
                </View>

                {/* Headline */}
                <Text style={styles.headline}>What's the emergency?</Text>
                <Text style={styles.subheadline}>
                    Select the type of assistance you need immediately.
                </Text>

                {/* Service type toggle */}
                <View style={styles.toggleContainer}>
                    {(['Towing', 'Roadside Repair'] as const).map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.toggleBtn, serviceType === t && styles.toggleBtnActive]}
                            onPress={() => setServiceType(t)}
                        >
                            <Text style={[styles.toggleText, serviceType === t && styles.toggleTextActive]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Issue grid */}
                <View style={styles.issueGrid}>
                    {ISSUES.map((issue) => (
                        <TouchableOpacity
                            key={issue.id}
                            style={[styles.issueCard, selectedIssue === issue.id && styles.issueCardActive]}
                            onPress={() => setSelectedIssue(issue.id)}
                        >
                            <Text style={styles.issueEmoji}>{issue.emoji}</Text>
                            <Text style={styles.issueLabel}>{issue.label}</Text>
                            <Text style={styles.issueSub}>{issue.sub}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Notes */}
                <View style={styles.notesCard}>
                    <Text style={styles.notesLabel}>📝  Additional Details</Text>
                    <TextInput
                        style={styles.notesInput}
                        placeholder="Describe your situation here..."
                        placeholderTextColor={COLORS.textMuted}
                        multiline
                        numberOfLines={3}
                        value={notes}
                        onChangeText={setNotes}
                    />
                </View>
            </ScrollView>

            {/* CTA */}
            <View style={styles.ctaContainer}>
                <TouchableOpacity style={styles.ctaBtn} onPress={handleRequestHelp}>
                    <Text style={styles.ctaBtnText}>🆘  Request Help Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { padding: 16, alignItems: 'center' },
    headerTitle: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 18 },

    // Map
    mapContainer: {
        height: 220,
        marginHorizontal: 16,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#1a253a',
        marginBottom: 8,
        position: 'relative',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    map: { flex: 1, borderRadius: 20 },
    mapLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    mapLoadingText: { color: COLORS.textSecondary, fontSize: 13 },
    mapText: { fontSize: 48 },
    mapErrorText: { color: COLORS.textSecondary, fontSize: 13 },
    locationChip: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        backgroundColor: `${COLORS.background}EE`,
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationLabel: {
        color: COLORS.textSecondary,
        fontSize: 9,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    locationValue: { color: COLORS.textPrimary, fontWeight: '600', fontSize: 13, marginTop: 2 },
    sosBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sosText: { color: '#fff', fontWeight: '800', fontSize: 11, letterSpacing: 1 },

    headline: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 20 },
    subheadline: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginHorizontal: 32, marginTop: 6 },

    toggleContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 20,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 14,
        padding: 4,
    },
    toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    toggleBtnActive: { backgroundColor: COLORS.primary },
    toggleText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 14 },
    toggleTextActive: { color: '#fff' },

    issueGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    issueCard: {
        width: '47%',
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        gap: 6,
    },
    issueCardActive: { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)' },
    issueEmoji: { fontSize: 28 },
    issueLabel: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 15 },
    issueSub: { color: COLORS.textSecondary, fontSize: 12 },

    notesCard: {
        marginHorizontal: 16,
        backgroundColor: COLORS.surfaceAccent,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    notesLabel: {
        color: COLORS.textSecondary,
        fontWeight: '700',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    notesInput: { color: COLORS.textPrimary, fontSize: 14, minHeight: 60 },

    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 32,
        backgroundColor: `${COLORS.background}CC`,
    },
    ctaBtn: {
        backgroundColor: '#EF4444',
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#EF4444',
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
    },
    ctaBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});
