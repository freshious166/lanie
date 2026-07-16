import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/data';
import { useRouter } from 'expo-router';

export default function DriverScorecardScreen() {
    const router = useRouter();
    const score = 85;

    const getScoreColor = (s: number) => {
        if (s >= 90) return COLORS.green;
        if (s >= 70) return COLORS.amber;
        return COLORS.red;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.textPrimary} onPress={() => router.back()} />
                <Text style={styles.headerTitle}>My Safety Scorecard</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.scoreCircleContainer}>
                    <View style={[styles.scoreCircle, { borderColor: getScoreColor(score) }]}>
                        <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>{score}</Text>
                        <Text style={styles.scoreLabel}>/ 100</Text>
                    </View>
                </View>
                
                <Text style={styles.greeting}>Great job this week!</Text>
                <Text style={styles.subtitle}>You are in the top 15% of fleet drivers.</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Factors</Text>
                    
                    <View style={styles.factorCard}>
                        <View style={styles.factorHeader}>
                            <MaterialCommunityIcons name="speedometer" size={24} color={COLORS.red} />
                            <Text style={styles.factorTitle}>Speeding Events</Text>
                            <Text style={styles.factorPenalty}>-10 pts</Text>
                        </View>
                        <Text style={styles.factorDesc}>You exceeded the speed limit by 15km/h on Lagos-Ibadan Expy.</Text>
                    </View>

                    <View style={styles.factorCard}>
                        <View style={styles.factorHeader}>
                            <MaterialCommunityIcons name="car-brake-alert" size={24} color={COLORS.amber} />
                            <Text style={styles.factorTitle}>Harsh Braking</Text>
                            <Text style={styles.factorPenalty}>-5 pts</Text>
                        </View>
                        <Text style={styles.factorDesc}>Sudden braking detected 2 times this week.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Coaching Tips</Text>
                    <View style={styles.tipBox}>
                        <MaterialCommunityIcons name="lightbulb-on" size={20} color={COLORS.primary} />
                        <Text style={styles.tipText}>Maintaining a steady speed reduces fuel consumption by up to 20%.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    headerTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
    content: { padding: 20 },
    scoreCircleContainer: { alignItems: 'center', marginVertical: 30 },
    scoreCircle: { width: 160, height: 160, borderRadius: 80, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
    scoreText: { fontSize: 48, fontWeight: '800' },
    scoreLabel: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '700', marginTop: -5 },
    greeting: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
    subtitle: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: 30 },
    section: { marginBottom: 30 },
    sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 12 },
    factorCard: { backgroundColor: COLORS.surfaceAccent, padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
    factorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    factorTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', flex: 1, marginLeft: 12 },
    factorPenalty: { color: COLORS.red, fontWeight: '800' },
    factorDesc: { color: COLORS.textSecondary, fontSize: 13, marginLeft: 36 },
    tipBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 16, borderRadius: 12, gap: 12 },
    tipText: { color: COLORS.primary, flex: 1, fontWeight: '600', lineHeight: 20 }
});
