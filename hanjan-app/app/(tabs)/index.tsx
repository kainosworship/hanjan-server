import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Container } from '../../src/components/common/Container';
import { Typography } from '../../src/components/common/Typography';
import { theme } from '../../src/theme';
import { Plus, MapTrifold, ListBullets } from 'phosphor-react-native';

const CATEGORIES = [
    { id: 'COFFEE', label: '커피', icon: '☕', color: theme.colors.categories.coffee },
    { id: 'MEAL', label: '식사', icon: '🍽️', color: theme.colors.categories.meal },
    { id: 'DRINK', label: '술', icon: '🍷', color: theme.colors.categories.drink },
    { id: 'WALK', label: '산책', icon: '🚶', color: theme.colors.categories.walk },
    { id: 'CULTURE', label: '문화', icon: '🎨', color: theme.colors.categories.culture },
    { id: 'ANYTHING', label: '뭐든', icon: '🎲', color: theme.colors.categories.anything },
];

export default function HomeScreen() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [location, setLocation] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);

            // Mock data for activities
            setActivities([
                { id: '1', category: 'COFFEE', message: '성수동 블루보틀 가실 분?', lat: loc.coords.latitude + 0.002, lng: loc.coords.longitude + 0.002, user: { nickname: '제이크', score: 4.5 } },
                { id: '2', category: 'MEAL', message: '점심 같이 드실 분?', lat: loc.coords.latitude - 0.001, lng: loc.coords.longitude + 0.003, user: { nickname: '사라', score: 4.8 } },
            ]);
        })();
    }, []);

    const renderActivityCard = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.card} onPress={() => { }}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary.light }]}>
                <Typography variant="bodyL">{CATEGORIES.find(c => c.id === item.category)?.icon}</Typography>
            </View>
            <View style={styles.cardContent}>
                <Typography variant="h3">{item.message}</Typography>
                <Typography variant="caption" color={theme.colors.neutral.mediumGray}>
                    {item.user.nickname} • ⭐ {item.user.score}
                </Typography>
            </View>
            <TouchableOpacity style={styles.joinBtn}>
                <Typography variant="buttonS" color={theme.colors.neutral.pureWhite}>참여</Typography>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h1" color={theme.colors.primary.coral}>🍷 한잔</Typography>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')} style={styles.iconBtn}>
                        {viewMode === 'map' ? <ListBullets size={24} /> : <MapTrifold size={24} />}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.categoryBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                            <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
                                <Typography>{cat.icon}</Typography>
                            </View>
                            <Typography variant="caption">{cat.label}</Typography>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {viewMode === 'map' ? (
                <View style={styles.mapContainer}>
                    {location && (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title="내 위치"
                            />
                            {activities.map(act => (
                                <Marker
                                    key={act.id}
                                    coordinate={{ latitude: act.lat, longitude: act.lng }}
                                    title={act.message}
                                >
                                    <View style={[styles.mapMarker, { backgroundColor: theme.colors.primary.coral }]}>
                                        <Typography color="white" variant="caption">
                                            {CATEGORIES.find(c => c.id === act.category)?.icon}
                                        </Typography>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
            ) : (
                <FlatList
                    data={activities}
                    renderItem={renderActivityCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(tabs)/create')}
            >
                <Plus size={32} color="white" weight="bold" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.neutral.pureWhite,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    headerRight: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    iconBtn: {
        padding: theme.spacing.xs,
        backgroundColor: theme.colors.neutral.lightGray,
        borderRadius: theme.radius.full,
    },
    categoryBar: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.neutral.lightGray,
        paddingBottom: theme.spacing.sm,
    },
    categoryScroll: {
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    categoryItem: {
        alignItems: 'center',
        gap: 4,
    },
    catIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapMarker: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
    },
    listContent: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.neutral.lightGray,
        borderRadius: theme.radius.lg,
        gap: theme.spacing.md,
    },
    categoryBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        gap: 2,
    },
    joinBtn: {
        backgroundColor: theme.colors.primary.coral,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.full,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary.coral,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
