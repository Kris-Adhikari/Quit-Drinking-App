import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAlcoholTracking } from '@/hooks/use-alcohol-tracking';
import { useAuth } from '@/hooks/use-auth';
import { useCoins } from '@/hooks/use-coins';

// Coin-based badges
const coinBadges = [
  {
    id: 'bronze',
    name: 'Bronze Badge',
    description: 'Purchase with 2000 coins',
    cost: 2000,
    badgeColor: '#CD7F32',
    emoji: '🥉',
  },
  {
    id: 'silver',
    name: 'Silver Badge', 
    description: 'Purchase with 5000 coins',
    cost: 5000,
    badgeColor: '#C0C0C0',
    emoji: '🥈',
  },
  {
    id: 'gold',
    name: 'Gold Badge',
    description: 'Purchase with 10000 coins',
    cost: 10000,
    badgeColor: '#FFD700',
    emoji: '🥇',
  },
  {
    id: 'emerald',
    name: 'Emerald Badge',
    description: 'Purchase with 20000 coins',
    cost: 20000,
    badgeColor: '#50C878',
    emoji: '💚',
  },
  {
    id: 'diamond',
    name: 'Diamond Badge',
    description: 'Purchase with 40000 coins',
    cost: 40000,
    badgeColor: '#B9F2FF',
    emoji: '💎',
  },
  {
    id: 'platinum',
    name: 'Platinum Badge',
    description: 'Purchase with 100000 coins',
    cost: 100000,
    badgeColor: '#E5E4E2',
    emoji: '🏆',
  },
];

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const { streakData } = useAlcoholTracking();
  const { coins, spendCoins, ownedBadges, purchaseBadge, loadCoins, loadOwnedBadges } = useCoins();

  // Reload coins and badges when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await loadCoins();
        await loadOwnedBadges();
      };
      loadData();
    }, [loadCoins, loadOwnedBadges])
  );

  // Check if badge is owned or can be purchased
  const canPurchaseBadge = (badge: any) => {
    return coins >= badge.cost && !ownedBadges.includes(badge.id);
  };

  const handlePurchaseBadge = async (badge: any) => {
    if (canPurchaseBadge(badge)) {
      const success = await spendCoins(badge.cost);
      if (success) {
        await purchaseBadge(badge.id);
      }
    }
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const BadgeItem = ({ badge }: { badge: any }) => {
    const isOwned = ownedBadges.includes(badge.id);
    const canPurchase = canPurchaseBadge(badge);
    
    return (
      <TouchableOpacity 
        style={styles.badgeItem} 
        activeOpacity={0.8}
        onPress={() => !isOwned && handlePurchaseBadge(badge)}
        disabled={isOwned || !canPurchase}
      >
        <View style={[
          styles.badgeCircle,
          { backgroundColor: isOwned ? badge.badgeColor : '#E0E0E0' }
        ]}>
          <Text style={styles.badgeEmoji}>
            {isOwned ? badge.emoji : '🔒'}
          </Text>
        </View>
        <Text style={[
          styles.badgeName,
          { color: isOwned ? '#1a1a1a' : canPurchase ? '#4169e1' : '#999999' }
        ]}>
          {badge.name}
        </Text>
        <Text style={[
          styles.badgeDescription,
          { color: isOwned ? '#666666' : '#BBBBBB' }
        ]}>
          {isOwned ? 'Owned' : `${badge.cost} coins`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Owned Badges Display */}
        <View style={styles.ownedBadgesSection}>
          <Text style={styles.sectionTitle}>My Badges</Text>
          <View style={styles.ownedBadgesContainer}>
            {ownedBadges.length === 0 ? (
              <Text style={styles.noBadgesText}>No badges owned yet</Text>
            ) : (
              coinBadges
                .filter(badge => ownedBadges.includes(badge.id))
                .map((badge) => (
                  <View key={badge.id} style={styles.ownedBadge}>
                    <View style={[styles.ownedBadgeCircle, { backgroundColor: badge.badgeColor }]}>
                      <Text style={styles.ownedBadgeEmoji}>{badge.emoji}</Text>
                    </View>
                    <Text style={styles.ownedBadgeName}>{badge.name}</Text>
                  </View>
                ))
            )}
          </View>
        </View>

        {/* Current Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Current Streak</Text>
          <Text style={styles.streakNumber}>{streakData.current_streak}</Text>
          <Text style={styles.streakLabel}>Days Alcohol-Free</Text>
        </View>

        {/* Badge Shop */}
        <View style={styles.badgeSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badge Shop</Text>
            <View style={styles.coinsDisplay}>
              <Text style={styles.coinsText}>🏅 {coins}</Text>
            </View>
          </View>
          <View style={styles.badgeGrid}>
            {coinBadges.map((badge) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
              />
            ))}
          </View>
          <View style={styles.platinumRewardMessage}>
            <Text style={styles.rewardMessageText}>
              Hit Platinum for $300+ mystery gift! 🎁
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
  },
  streakCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 16,
    color: '#e6d6ff',
  },
  ownedBadgesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coinsDisplay: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ownedBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    minHeight: 80,
    alignItems: 'center',
  },
  noBadgesText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  ownedBadge: {
    alignItems: 'center',
    marginBottom: 10,
  },
  ownedBadgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ownedBadgeEmoji: {
    fontSize: 32,
  },
  ownedBadgeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  badgeSection: {
    marginBottom: 30,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  platinumRewardMessage: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#E5E4E2',
    alignItems: 'center',
  },
  rewardMessageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});