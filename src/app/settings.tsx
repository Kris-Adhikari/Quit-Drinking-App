import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/use-auth';
import { useSettings } from '@/hooks/use-settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function Settings() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { settings, updateSetting, getFormattedReminderTime, getDrinkUnitLabel } = useSettings();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [newName, setNewName] = useState(settings.displayName || user?.email?.split('@')[0] || '');
  const [newDailyGoal, setNewDailyGoal] = useState(settings.dailyGoal.toString());
  const [newPrice, setNewPrice] = useState(settings.pricePerDrink.toString());

  const handleToggleSetting = async (key: string, value: boolean) => {
    await updateSetting(key as any, value);
  };

  const handleSaveDailyGoal = async () => {
    const goal = parseInt(newDailyGoal) || 0;
    await updateSetting('dailyGoal', goal);
    setShowGoalModal(false);
    Alert.alert('Success', 'Your daily goal has been updated.');
  };

  const handleSavePrice = async () => {
    const price = parseFloat(newPrice) || 0;
    await updateSetting('pricePerDrink', price);
    setShowPriceModal(false);
    Alert.alert('Success', 'Price per drink has been updated.');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your progress data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert('Account deleted', 'Your account has been deleted.');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your progress data will be prepared for download. You\'ll receive an email with your data within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Request Export', onPress: () => console.log('Export requested') },
      ]
    );
  };

  const handleSaveName = async () => {
    await updateSetting('displayName', newName);
    setShowNameModal(false);
    Alert.alert('Success', 'Your name has been updated.');
  };

  const settingsCategories = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit_name',
          title: 'Name',
          subtitle: settings.displayName || newName || 'Tap to set your name',
          icon: 'person-outline',
          type: 'action' as const,
          onPress: () => setShowNameModal(true),
        },
        {
          id: 'email',
          title: 'Email',
          subtitle: user?.email || 'Not signed in',
          icon: 'mail-outline',
          type: 'action' as const,
          onPress: () => Alert.alert('Email', 'Email editing coming soon'),
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Manage your premium subscription',
          icon: 'card-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Subscription', 'Subscription management coming soon'),
        },
      ],
    },
    {
      title: 'Recovery Settings',
      items: [
        {
          id: 'daily_goal',
          title: 'Daily Drink Goal',
          subtitle: settings.dailyGoal === 0 ? 'No drinking goal' : `Max ${settings.dailyGoal} ${getDrinkUnitLabel()} per day`,
          icon: 'target-outline',
          type: 'action' as const,
          onPress: () => {
            setNewDailyGoal(settings.dailyGoal.toString());
            setShowGoalModal(true);
          },
        },
        {
          id: 'tracking_unit',
          title: 'Tracking Unit',
          subtitle: `Measure drinks in ${getDrinkUnitLabel()}`,
          icon: 'bar-chart-outline',
          type: 'action' as const,
          onPress: () => {
            Alert.alert(
              'Tracking Unit',
              'Choose how to measure your drinks',
              [
                { text: 'Standard Drinks', onPress: () => updateSetting('trackingUnit', 'standard') },
                { text: 'Alcohol Units', onPress: () => updateSetting('trackingUnit', 'units') },
                { text: 'Milliliters', onPress: () => updateSetting('trackingUnit', 'ml') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
        {
          id: 'reminder_time',
          title: 'Daily Check-in Time',
          subtitle: `Remind me at ${getFormattedReminderTime()}`,
          icon: 'alarm-outline',
          type: 'action' as const,
          onPress: () => Alert.alert('Reminder Time', 'Time picker coming soon'),
        },
        {
          id: 'price_per_drink',
          title: 'Average Drink Price',
          subtitle: `$${settings.pricePerDrink.toFixed(2)} per drink`,
          icon: 'cash-outline',
          type: 'action' as const,
          onPress: () => {
            setNewPrice(settings.pricePerDrink.toString());
            setShowPriceModal(true);
          },
        },
        {
          id: 'show_money_spent',
          title: 'Show Money Saved',
          subtitle: 'Display money saved calculations',
          icon: 'wallet-outline',
          type: 'toggle' as const,
          value: settings.showMoneySpent,
          onToggle: (value) => updateSetting('showMoneySpent', value),
        },
        {
          id: 'week_start',
          title: 'Week Starts On',
          subtitle: settings.weekStart === 'monday' ? 'Monday' : 'Sunday',
          icon: 'calendar-outline',
          type: 'action' as const,
          onPress: () => {
            Alert.alert(
              'Week Start',
              'Choose when your week starts for progress calculations',
              [
                { text: 'Monday', onPress: () => updateSetting('weekStart', 'monday') },
                { text: 'Sunday', onPress: () => updateSetting('weekStart', 'sunday') },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push_notifications',
          title: 'Push Notifications',
          subtitle: 'Enable notifications from the app',
          icon: 'notifications-outline',
          type: 'toggle' as const,
          value: settings.pushNotifications,
          onToggle: (value) => updateSetting('pushNotifications', value),
        },
        {
          id: 'daily_reminders',
          title: 'Daily Check-ins',
          subtitle: 'Remind me to log my progress',
          icon: 'time-outline',
          type: 'toggle' as const,
          value: settings.dailyReminders,
          onToggle: (value) => updateSetting('dailyReminders', value),
        },
        {
          id: 'achievement_notifications',
          title: 'Achievement Alerts',
          subtitle: 'Celebrate milestones and streaks',
          icon: 'trophy-outline',
          type: 'toggle' as const,
          value: settings.achievementNotifications,
          onToggle: (value) => updateSetting('achievementNotifications', value),
        },
        {
          id: 'progress_reports',
          title: 'Weekly Progress',
          subtitle: 'Get weekly progress summaries',
          icon: 'stats-chart-outline',
          type: 'toggle' as const,
          value: settings.progressReports,
          onToggle: (value) => updateSetting('progressReports', value),
        },
        {
          id: 'community_updates',
          title: 'Community Updates',
          subtitle: 'Notifications from community posts',
          icon: 'people-outline',
          type: 'toggle' as const,
          value: settings.communityUpdates,
          onToggle: (value) => updateSetting('communityUpdates', value),
        },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          id: 'data_collection',
          title: 'Analytics',
          subtitle: 'Help improve the app with usage data',
          icon: 'analytics-outline',
          type: 'toggle' as const,
          value: settings.dataCollection,
          onToggle: (value) => updateSetting('dataCollection', value),
        },
        {
          id: 'crash_reporting',
          title: 'Crash Reports',
          subtitle: 'Send crash reports to improve stability',
          icon: 'bug-outline',
          type: 'toggle' as const,
          value: settings.crashReporting,
          onToggle: (value) => updateSetting('crashReporting', value),
        },
        {
          id: 'export_data',
          title: 'Export My Data',
          subtitle: 'Download all your progress data',
          icon: 'download-outline',
          type: 'action' as const,
          onPress: handleExportData,
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          id: 'dark_mode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme (coming soon)',
          icon: 'moon-outline',
          type: 'toggle' as const,
          value: settings.darkMode,
          onToggle: (value) => updateSetting('darkMode', value),
        },
        {
          id: 'privacy_policy',
          title: 'Privacy Policy',
          icon: 'shield-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy will open in browser'),
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: 'document-text-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Terms', 'Terms will open in browser'),
        },
        {
          id: 'contact',
          title: 'Contact Support',
          subtitle: 'Get help with the app',
          icon: 'help-circle-outline',
          type: 'navigation' as const,
          onPress: () => Alert.alert('Support', 'Support contact coming soon'),
        },
        {
          id: 'version',
          title: 'Version',
          subtitle: '1.0.0',
          icon: 'information-circle-outline',
          type: 'action' as const,
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'sign_out',
          title: 'Sign Out',
          icon: 'log-out-outline',
          type: 'action' as const,
          onPress: handleSignOut,
        },
        {
          id: 'delete_account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account and data',
          icon: 'trash-outline',
          type: 'action' as const,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingsItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.settingItem,
          item.id === 'delete_account' && styles.dangerItem,
        ]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      >
        <View style={styles.settingLeft}>
          <View style={[
            styles.settingIcon,
            item.id === 'delete_account' && styles.dangerIcon,
          ]}>
            <Ionicons 
              name={item.icon as any} 
              size={20} 
              color={item.id === 'delete_account' ? '#FF3B30' : '#666666'} 
            />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[
              styles.settingTitle,
              item.id === 'delete_account' && styles.dangerText,
            ]}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.type === 'toggle' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#e0e0e0', true: '#4a90e2' }}
              thumbColor={item.value ? '#ffffff' : '#ffffff'}
            />
          )}
          {item.type === 'navigation' && (
            <Ionicons name="chevron-forward" size={20} color="#cccccc" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.categoryItems}>
              {category.items.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal
        visible={showNameModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNameModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNameModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TouchableOpacity onPress={handleSaveName}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Display Name</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter your name"
              autoFocus
              maxLength={50}
            />
            <Text style={styles.modalHint}>
              This name will be displayed in your profile and achievements.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Daily Goal Modal */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowGoalModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Daily Goal</Text>
            <TouchableOpacity onPress={handleSaveDailyGoal}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Maximum drinks per day</Text>
            <TextInput
              style={styles.modalInput}
              value={newDailyGoal}
              onChangeText={setNewDailyGoal}
              placeholder="0 for no drinking goal"
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.modalHint}>
              Set to 0 for complete sobriety goal, or set a reduction target.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Price Edit Modal */}
      <Modal
        visible={showPriceModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPriceModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPriceModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Drink Price</Text>
            <TouchableOpacity onPress={handleSavePrice}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Average price per drink ($)</Text>
            <TextInput
              style={styles.modalInput}
              value={newPrice}
              onChangeText={setNewPrice}
              placeholder="8.50"
              keyboardType="decimal-pad"
              autoFocus
            />
            <Text style={styles.modalHint}>
              Used to calculate money saved from not drinking.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryContainer: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryItems: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  settingRight: {
    alignItems: 'center',
  },
  dangerItem: {
    backgroundColor: '#fff5f5',
  },
  dangerIcon: {
    backgroundColor: '#ffe6e6',
  },
  dangerText: {
    color: '#FF3B30',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a90e2',
  },
  modalContent: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
  },
  modalHint: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});