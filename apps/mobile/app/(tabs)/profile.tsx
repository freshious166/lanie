import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOffline } from '../../hooks/useOffline';
import { COLORS } from '../../constants/data';

const DEFAULT_USER = {
    name: 'Alex Laine',
    email: 'alex.laine@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    memberSince: 'January 2024',
    vehiclesCount: 2,
    historyCount: 15,
};

export default function ProfileScreen() {
    const { saveData, getData } = useOffline();
    const [user, setUser] = React.useState(DEFAULT_USER);

    React.useEffect(() => {
        const initData = async () => {
            const cached = await getData<typeof DEFAULT_USER>('cached_user');
            if (cached) {
                setUser(cached);
            } else {
                await saveData('cached_user', DEFAULT_USER);
            }
        };
        initData();
    }, []);

    const menuItems = [
        { icon: 'account-edit', label: 'Edit Profile', color: COLORS.primary },
        { icon: 'shield-check', label: 'Security & Privacy', color: COLORS.green },
        { icon: 'bell-outline', label: 'Notifications', color: COLORS.amber },
        { icon: 'wallet-outline', label: 'Payment Methods', color: COLORS.primary },
        { icon: 'help-circle-outline', label: 'Help & Support', color: COLORS.textSecondary },
        { icon: 'logout', label: 'Logout', color: COLORS.red },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="cog-outline" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>

                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>ELITE MEMBER</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{user.vehiclesCount}</Text>
                        <Text style={styles.statLabel}>Vehicles</Text>
                    </View>
                    <View style={[styles.statBox, styles.statBorder]}>
                        <Text style={styles.statValue}>{user.historyCount}</Text>
                        <Text style={styles.statLabel}>Activities</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>4.9/5</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[
                                styles.menuItem,
                                index === menuItems.length - 1 && styles.menuItemLast
                            ]}
                        >
                            <View style={[styles.iconBg, { backgroundColor: `${item.color}20` }]}>
                                <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                            </View>
                            <Text style={[styles.menuLabel, item.color === COLORS.red && { color: COLORS.red }]}>
                                {item.label}
                            </Text>
                            <MaterialCommunityIcons 
                                name="chevron-right" 
                                size={20} 
                                color={COLORS.textMuted} 
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>LaineFleet v1.0.0</Text>
                    <Text style={styles.copyrightText}>© 2026 LaineFleet Inc.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.background,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: `${COLORS.amber}20`,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: `${COLORS.amber}40`,
    },
    badgeText: {
        color: COLORS.amber,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    menuSection: {
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        borderRadius: 24,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    versionText: {
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    copyrightText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 4,
    },
});
