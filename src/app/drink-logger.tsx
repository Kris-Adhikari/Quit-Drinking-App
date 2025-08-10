import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAlcoholTracking } from '@/hooks/use-alcohol-tracking';
import { CustomDrink } from '@/types/alcohol-log';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCoins } from '@/hooks/use-coins';
import { useUserProfile } from '@/hooks/use-user-profile';

interface QuickDrink {
  id: string;
  name: string;
  emoji: string;
  standardDrink: number;
  volume: number; // ml
  abv: number; // percentage
  calories: number;
  price: number;
}

const quickDrinks: QuickDrink[] = [
  { id: 'beer_standard', name: 'Beer (12 oz)', emoji: '🍺', standardDrink: 1, volume: 355, abv: 5, calories: 150, price: 5 },
  { id: 'wine_glass', name: 'Wine (5 oz)', emoji: '🍷', standardDrink: 1, volume: 148, abv: 12, calories: 125, price: 8 },
  { id: 'shot_spirits', name: 'Shot (1.5 oz)', emoji: '🥃', standardDrink: 1, volume: 44, abv: 40, calories: 100, price: 6 },
  { id: 'cocktail_mixed', name: 'Cocktail', emoji: '🍸', standardDrink: 1.5, volume: 150, abv: 15, calories: 200, price: 12 },
];

export default function DrinkLogger() {
  const router = useRouter();
  const { addAlcoholLog, loading } = useAlcoholTracking();
  const { addCoins } = useCoins();
  const { reloadProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'quick' | 'saved' | 'new'>('quick');
  const [savedDrinks, setSavedDrinks] = useState<CustomDrink[]>([]);
  const [showAddDrinkModal, setShowAddDrinkModal] = useState(false);
  const [showNoDrinksCongrats, setShowNoDrinksCongrats] = useState(false);
  const [noDrinksAlreadyLogged, setNoDrinksAlreadyLogged] = useState(false);
  
  // Quantity state for each drink
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  
  // Edit state
  const [editingDrink, setEditingDrink] = useState<CustomDrink | null>(null);
  const [editingQuickDrink, setEditingQuickDrink] = useState<QuickDrink | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditQuickModal, setShowEditQuickModal] = useState(false);
  const [customizedQuickDrinks, setCustomizedQuickDrinks] = useState<QuickDrink[]>([]);
  
  // Form state for new drink
  const [drinkForm, setDrinkForm] = useState({
    name: '',
    emoji: '🍺',
    volume: '',
    abv: '',
    calories: '',
    price: '',
    notes: '',
  });

  const emojiOptions = ['🍺', '🍷', '🥃', '🍸', '🍹', '🥂', '🍾', '🧉', '🍻', '🥤'];

  // Track calories for today (frontend-only, resets daily)
  const trackTodayCalories = async (caloriesAdded: number) => {
    try {
      const today = new Date().toDateString();
      const currentCaloriesData = await AsyncStorage.getItem('todayCalories');
      
      let currentCalories = 0;
      if (currentCaloriesData) {
        const { date, calories } = JSON.parse(currentCaloriesData);
        if (date === today) {
          currentCalories = calories || 0;
        }
      }
      
      const newTotal = currentCalories + caloriesAdded;
      await AsyncStorage.setItem('todayCalories', JSON.stringify({
        date: today,
        calories: newTotal
      }));
      
    } catch (error) {
      console.log('Error tracking calories:', error);
    }
  };

  // Load saved drinks and check if no drinks was already logged today
  useEffect(() => {
    loadSavedDrinks();
    loadCustomizedQuickDrinks();
    checkNoDrinksToday();
  }, []);

  const loadSavedDrinks = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedDrinks');
      if (saved) {
        setSavedDrinks(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading saved drinks:', error);
    }
  };

  const loadCustomizedQuickDrinks = async () => {
    try {
      const saved = await AsyncStorage.getItem('customizedQuickDrinks');
      if (saved) {
        setCustomizedQuickDrinks(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading customized quick drinks:', error);
    }
  };

  const checkNoDrinksToday = async () => {
    try {
      const today = new Date().toDateString();
      const noDrinksData = await AsyncStorage.getItem('noDrinksToday');
      if (noDrinksData) {
        const data = JSON.parse(noDrinksData);
        if (data.date === today) {
          setNoDrinksAlreadyLogged(true);
        }
      }
    } catch (error) {
      console.log('Error checking no drinks status:', error);
    }
  };

  const saveDrink = async (drink: Omit<CustomDrink, 'id' | 'user_id' | 'created_at'>) => {
    const newDrink: CustomDrink = {
      id: `custom-${Date.now()}`,
      user_id: 'user', // This would be actual user ID in production
      ...drink,
      created_at: new Date().toISOString(),
    };

    const updated = [...savedDrinks, newDrink];
    setSavedDrinks(updated);
    
    try {
      await AsyncStorage.setItem('savedDrinks', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving drink:', error);
    }
  };

  const calculateStandardDrinks = (volume: number, abv: number): number => {
    // Standard drink = 14g of pure alcohol
    // Formula: (Volume in ml × ABV% × 0.789) ÷ 14
    return (volume * (abv / 100) * 0.789) / 14;
  };

  const getQuantity = (drinkId: string): number => {
    return quantities[drinkId] || 1;
  };

  const updateQuantity = (drinkId: string, change: number) => {
    const currentQty = getQuantity(drinkId);
    const newQty = Math.max(1, currentQty + change);
    setQuantities(prev => ({...prev, [drinkId]: newQty}));
  };

  const resetQuantity = (drinkId: string) => {
    setQuantities(prev => {
      const updated = {...prev};
      delete updated[drinkId];
      return updated;
    });
  };

  const deleteDrink = async (drinkId: string) => {
    Alert.alert(
      'Delete Drink',
      'Are you sure you want to delete this drink?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = savedDrinks.filter(drink => drink.id !== drinkId);
            setSavedDrinks(updated);
            try {
              await AsyncStorage.setItem('savedDrinks', JSON.stringify(updated));
            } catch (error) {
              console.log('Error deleting drink:', error);
            }
          }
        }
      ]
    );
  };

  const startEditDrink = (drink: CustomDrink) => {
    setEditingDrink(drink);
    setDrinkForm({
      name: drink.name,
      emoji: drink.emoji || '🍺',
      volume: drink.volume.toString(),
      abv: drink.alcohol_content.toString(),
      calories: drink.calories.toString(),
      price: drink.price.toString(),
      notes: '',
    });
    setShowEditModal(true);
  };

  const handleEditDrink = async () => {
    if (!editingDrink) return;
    
    const { name, volume, abv, calories, price } = drinkForm;
    
    if (!name.trim() || !volume || !abv) {
      Alert.alert('Error', 'Please fill in drink name, volume, and alcohol content.');
      return;
    }

    const volumeNum = parseFloat(volume);
    const abvNum = parseFloat(abv);
    const caloriesNum = parseFloat(calories) || 0;
    const priceNum = parseFloat(price) || 0;

    if (isNaN(volumeNum) || isNaN(abvNum) || volumeNum <= 0 || abvNum < 0 || abvNum > 100) {
      Alert.alert('Error', 'Please enter valid numbers for volume and alcohol content.');
      return;
    }

    const standardDrinks = calculateStandardDrinks(volumeNum, abvNum);

    const updatedDrink: CustomDrink = {
      ...editingDrink,
      name: name.trim(),
      emoji: drinkForm.emoji,
      volume: volumeNum,
      alcohol_content: abvNum,
      calories: caloriesNum,
      price: priceNum,
      standard_drinks: standardDrinks,
    };

    const updated = savedDrinks.map(drink => 
      drink.id === editingDrink.id ? updatedDrink : drink
    );
    setSavedDrinks(updated);
    
    try {
      await AsyncStorage.setItem('savedDrinks', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating drink:', error);
    }

    setShowEditModal(false);
    setEditingDrink(null);
    setDrinkForm({
      name: '',
      emoji: '🍺',
      volume: '',
      abv: '',
      calories: '',
      price: '',
      notes: '',
    });
  };

  // Quick drink edit functions
  const startEditQuickDrink = (drink: QuickDrink) => {
    setEditingQuickDrink(drink);
    setDrinkForm({
      name: drink.name,
      emoji: drink.emoji,
      volume: drink.volume.toString(),
      abv: drink.abv.toString(),
      calories: drink.calories.toString(),
      price: drink.price.toString(),
      notes: '',
    });
    setShowEditQuickModal(true);
  };

  const handleEditQuickDrink = async () => {
    if (!editingQuickDrink) return;
    
    const { name, volume, abv, calories, price } = drinkForm;
    
    if (!name.trim() || !volume || !abv) {
      Alert.alert('Error', 'Please fill in drink name, volume, and alcohol content.');
      return;
    }

    const volumeNum = parseFloat(volume);
    const abvNum = parseFloat(abv);
    const caloriesNum = parseFloat(calories) || 0;
    const priceNum = parseFloat(price) || 0;

    if (isNaN(volumeNum) || isNaN(abvNum) || volumeNum <= 0 || abvNum < 0 || abvNum > 100) {
      Alert.alert('Error', 'Please enter valid numbers for volume and alcohol content.');
      return;
    }

    const standardDrinks = calculateStandardDrinks(volumeNum, abvNum);

    const updatedQuickDrink: QuickDrink = {
      ...editingQuickDrink,
      name: name.trim(),
      emoji: drinkForm.emoji,
      volume: volumeNum,
      abv: abvNum,
      calories: caloriesNum,
      price: priceNum,
      standardDrink: standardDrinks,
    };

    // Update or add to customized quick drinks
    const existingIndex = customizedQuickDrinks.findIndex(d => d.id === editingQuickDrink.id);
    let updatedCustomized;
    
    if (existingIndex >= 0) {
      updatedCustomized = customizedQuickDrinks.map(drink => 
        drink.id === editingQuickDrink.id ? updatedQuickDrink : drink
      );
    } else {
      updatedCustomized = [...customizedQuickDrinks, updatedQuickDrink];
    }
    
    setCustomizedQuickDrinks(updatedCustomized);
    
    try {
      await AsyncStorage.setItem('customizedQuickDrinks', JSON.stringify(updatedCustomized));
    } catch (error) {
      console.log('Error updating quick drink:', error);
    }

    setShowEditQuickModal(false);
    setEditingQuickDrink(null);
    setDrinkForm({
      name: '',
      emoji: '🍺',
      volume: '',
      abv: '',
      calories: '',
      price: '',
      notes: '',
    });
  };

  const resetQuickDrink = async (drinkId: string) => {
    Alert.alert(
      'Reset to Default',
      'Reset this drink to its original values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'default',
          onPress: async () => {
            const updated = customizedQuickDrinks.filter(drink => drink.id !== drinkId);
            setCustomizedQuickDrinks(updated);
            try {
              await AsyncStorage.setItem('customizedQuickDrinks', JSON.stringify(updated));
            } catch (error) {
              console.log('Error resetting quick drink:', error);
            }
          }
        }
      ]
    );
  };

  // Get the current version of a quick drink (customized or default)
  const getCurrentQuickDrink = (originalDrink: QuickDrink): QuickDrink => {
    const customized = customizedQuickDrinks.find(d => d.id === originalDrink.id);
    return customized || originalDrink;
  };

  const handleQuickDrink = async (drink: QuickDrink) => {
    const quantity = getQuantity(drink.id);
    const totalCalories = drink.calories * quantity;
    try {
      await addAlcoholLog(
        drink.standardDrink * quantity,
        drink.name,
        drink.price * quantity,
        totalCalories,
        drink.abv,
        drink.volume * quantity
      );
      
      // Track calories for today
      await trackTodayCalories(totalCalories);
      
      resetQuantity(drink.id);
      await showSuccessAlert(`${quantity}x ${drink.name}`, drink.standardDrink * quantity);
    } catch (error) {
      Alert.alert('Error', 'Failed to log drink. Please try again.');
    }
  };

  const handleCustomDrink = async (drink: CustomDrink) => {
    const quantity = getQuantity(drink.id);
    const totalCalories = drink.calories * quantity;
    try {
      await addAlcoholLog(
        drink.standard_drinks * quantity,
        drink.name,
        drink.price * quantity,
        totalCalories,
        drink.alcohol_content,
        drink.volume * quantity
      );
      
      // Track calories for today
      await trackTodayCalories(totalCalories);
      
      resetQuantity(drink.id);
      await showSuccessAlert(`${quantity}x ${drink.name}`, drink.standardDrink * quantity);
    } catch (error) {
      Alert.alert('Error', 'Failed to log drink. Please try again.');
    }
  };

  const handleAddNewDrink = async () => {
    const { name, volume, abv, calories, price } = drinkForm;
    
    if (!name.trim() || !volume || !abv) {
      Alert.alert('Error', 'Please fill in drink name, volume, and alcohol content.');
      return;
    }

    const volumeNum = parseFloat(volume);
    const abvNum = parseFloat(abv);
    const caloriesNum = parseFloat(calories) || 0;
    const priceNum = parseFloat(price) || 0;

    if (isNaN(volumeNum) || isNaN(abvNum) || volumeNum <= 0 || abvNum < 0 || abvNum > 100) {
      Alert.alert('Error', 'Please enter valid numbers for volume and alcohol content.');
      return;
    }

    const standardDrinks = calculateStandardDrinks(volumeNum, abvNum);

    const newDrink = {
      name: name.trim(),
      emoji: drinkForm.emoji,
      volume: volumeNum,
      alcohol_content: abvNum,
      calories: caloriesNum,
      price: priceNum,
      standard_drinks: standardDrinks,
    };

    await saveDrink(newDrink);
    
    // Also log it immediately
    try {
      await addAlcoholLog(
        standardDrinks,
        name.trim(),
        priceNum,
        caloriesNum,
        abvNum,
        volumeNum,
        drinkForm.notes
      );
      
      // Track calories for today
      await trackTodayCalories(caloriesNum);
      
      setShowAddDrinkModal(false);
      setDrinkForm({
        name: '',
        emoji: '🍺',
        volume: '',
        abv: '',
        calories: '',
        price: '',
        notes: '',
      });
      
      await showSuccessAlert(name.trim(), standardDrinks);
    } catch (error) {
      Alert.alert('Error', 'Drink saved but failed to log. You can log it from your saved drinks.');
    }
  };

  const showSuccessAlert = async (drinkName: string, amount: number = 1) => {
    // Mark the task as completed when a drink is logged
    await markDrinkTaskCompleted(true);
    
    // Update the drink count in storage
    try {
      const dateKey = new Date().toDateString();
      const existingCountData = await AsyncStorage.getItem('todayDrinkCountDate');
      let currentCount = 0;
      
      // Check if we have count from today
      if (existingCountData === dateKey) {
        const count = await AsyncStorage.getItem('todayDrinkCount');
        currentCount = count ? parseFloat(count) : 0;
      }
      
      const newCount = currentCount + amount;
      await AsyncStorage.setItem('todayDrinkCount', newCount.toString());
      await AsyncStorage.setItem('todayDrinkCountDate', dateKey);
    } catch (error) {
      console.log('Error updating drink count:', error);
    }
    
    Alert.alert(
      'Drink Logged',
      `${drinkName} has been added to your daily log.`,
      [
        {
          text: 'Add Another',
          style: 'default',
        },
        {
          text: 'Done',
          style: 'default',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const markDrinkTaskCompleted = async (isDrinkLogged: boolean = true) => {
    try {
      // Get existing completed tasks
      const completedTasks = await AsyncStorage.getItem('completedTasks');
      const tasks = completedTasks ? JSON.parse(completedTasks) : {};
      
      // Mark today's drink logging task as completed
      const todayDrinkTaskId = `task_drinks_0`; // 0 is for today
      tasks[todayDrinkTaskId] = true;
      
      // Store whether this was from logging drinks or "No Drinks Today"
      const drinkStatus = isDrinkLogged ? 'logged' : 'sober';
      await AsyncStorage.setItem('todayDrinkStatus', JSON.stringify({ 
        date: new Date().toDateString(), 
        status: drinkStatus 
      }));
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('completedTasks', JSON.stringify(tasks));
      console.log('Marked drink task as completed with status:', drinkStatus);
    } catch (error) {
      console.log('Error marking drink task completed:', error);
    }
  };

  const handleNoDrinksToday = async () => {
    // Check if already logged today
    if (noDrinksAlreadyLogged) {
      Alert.alert(
        'Already Logged',
        "You've already marked today as a no-drink day!",
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if coins were already given today
    const today = new Date().toDateString();
    const coinRewardKey = await AsyncStorage.getItem('noDrinksCoinsReward');
    let shouldGiveCoins = true;
    
    if (coinRewardKey) {
      const rewardData = JSON.parse(coinRewardKey);
      if (rewardData.date === today) {
        shouldGiveCoins = false;
      }
    }
    
    setShowNoDrinksCongrats(true);
    setNoDrinksAlreadyLogged(true);
    
    // Save no drinks status for today
    try {
      await AsyncStorage.setItem('noDrinksToday', JSON.stringify({ date: today }));
    } catch (error) {
      console.log('Error saving no drinks status:', error);
    }
    
    // Mark the task as completed with sober status
    await markDrinkTaskCompleted(false);
    
    // Add 25 coins reward only if not already given today
    if (shouldGiveCoins) {
      try {
        await addCoins(25);
        await reloadProfile(); // Reload to show updated coins
        await AsyncStorage.setItem('noDrinksCoinsReward', JSON.stringify({ date: today }));
        console.log('Added 25 coins for no drinks today');
      } catch (error) {
        console.log('Error adding coins:', error);
      }
    }
    
    // Auto-close congratulations after 3 seconds and go back
    setTimeout(() => {
      setShowNoDrinksCongrats(false);
      router.back();
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Your Drinks</Text>
        <TouchableOpacity onPress={() => setShowAddDrinkModal(true)} style={styles.addButton}>
          <View style={styles.addButtonContent}>
            <Ionicons name="add-circle" size={18} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Drink</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'quick' && styles.activeTab]}
          onPress={() => setActiveTab('quick')}
        >
          <Text style={[styles.tabText, activeTab === 'quick' && styles.activeTabText]}>Quick Add</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>My Drinks</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* No Drinks Today Button */}
        <TouchableOpacity 
          style={[
            styles.noDrinksTodayButton,
            noDrinksAlreadyLogged && styles.noDrinksTodayButtonDisabled
          ]}
          onPress={handleNoDrinksToday}
          disabled={noDrinksAlreadyLogged}
        >
          <View style={styles.noDrinksContent}>
            <View>
              <Text style={styles.noDrinksTitle}>
                {noDrinksAlreadyLogged ? 'Already Logged Today' : 'No Drinks Today'}
              </Text>
              <Text style={styles.noDrinksSubtitle}>
                {noDrinksAlreadyLogged ? 'Great job staying sober!' : 'Tap here if you\'re staying sober today!'}
              </Text>
            </View>
            <Text style={styles.noDrinksEmoji}>{noDrinksAlreadyLogged ? '✅' : '🎉'}</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Add Tab */}
        {activeTab === 'quick' && (
          <View>
            <Text style={styles.sectionTitle}>Common Drinks</Text>
            <Text style={styles.sectionSubtitle}>Tap to quickly log these standard drinks</Text>
            
            <View style={styles.drinksGrid}>
              {quickDrinks.map((originalDrink) => {
                const drink = getCurrentQuickDrink(originalDrink);  
                const quantity = getQuantity(drink.id);
                const isCustomized = customizedQuickDrinks.some(d => d.id === drink.id);
                
                return (
                  <View key={drink.id} style={styles.drinkCard}>
                    {/* Edit/Reset buttons */}
                    <View style={styles.drinkCardActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => startEditQuickDrink(drink)}
                      >
                        <Ionicons name="pencil" size={14} color="#4169e1" />
                      </TouchableOpacity>
                      {isCustomized && (
                        <TouchableOpacity 
                          style={styles.resetButton}
                          onPress={() => resetQuickDrink(drink.id)}
                        >
                          <Ionicons name="refresh" size={14} color="#f59e0b" />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={styles.drinkEmoji}>{drink.emoji}</Text>
                    <Text style={styles.drinkName}>{drink.name}</Text>
                    <Text style={styles.drinkDetails}>
                      {(drink.standardDrink * quantity).toFixed(1)} std drinks
                    </Text>
                    <Text style={styles.drinkMeta}>
                      {drink.calories * quantity} cal • ${(drink.price * quantity).toFixed(2)}
                    </Text>
                    {isCustomized && <Text style={styles.customizedLabel}>Customized</Text>}
                    
                    {/* Quantity Controls */}
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(drink.id, -1)}
                        disabled={quantity <= 1}
                      >
                        <Ionicons name="remove" size={16} color={quantity <= 1 ? "#ccc" : "#666"} />
                      </TouchableOpacity>
                      
                      <Text style={styles.quantityText}>{quantity}</Text>
                      
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(drink.id, 1)}
                      >
                        <Ionicons name="add" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                    
                    {/* Add Button */}
                    <TouchableOpacity
                      style={styles.addToLogButton}
                      onPress={() => handleQuickDrink(drink)}
                      disabled={loading}
                    >
                      <Ionicons name="add-circle" size={16} color="#ffffff" />
                      <Text style={styles.addToLogButtonText}>
                        {loading ? 'Adding...' : 'Add to Log'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Saved Drinks Tab */}
        {activeTab === 'saved' && (
          <View>
            <Text style={styles.sectionTitle}>Your Saved Drinks</Text>
            <Text style={styles.sectionSubtitle}>Drinks you've created with custom details</Text>
            
            {savedDrinks.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="wine" size={48} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No saved drinks yet</Text>
                <Text style={styles.emptyStateText}>Tap "Add Drink" above to create your first custom drink</Text>
              </View>
            ) : (
              <View style={styles.drinksGrid}>
                {savedDrinks.map((drink) => {
                  const quantity = getQuantity(drink.id);
                  return (
                    <View key={drink.id} style={styles.drinkCard}>
                      {/* Edit/Delete buttons */}
                      <View style={styles.drinkCardActions}>
                        <TouchableOpacity 
                          style={styles.editButton}
                          onPress={() => startEditDrink(drink)}
                        >
                          <Ionicons name="pencil" size={14} color="#4169e1" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => deleteDrink(drink.id)}
                        >
                          <Ionicons name="trash" size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.drinkEmoji}>{drink.emoji || '🍺'}</Text>
                      <Text style={styles.drinkName}>{drink.name}</Text>
                      <Text style={styles.drinkDetails}>
                        {(drink.standard_drinks * quantity).toFixed(1)} std drinks
                      </Text>
                      <Text style={styles.drinkMeta}>
                        {Math.round(drink.calories * quantity)} cal • ${(drink.price * quantity).toFixed(2)}
                      </Text>
                      
                      {/* Quantity Controls */}
                      <View style={styles.quantityControls}>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(drink.id, -1)}
                          disabled={quantity <= 1}
                        >
                          <Ionicons name="remove" size={16} color={quantity <= 1 ? "#ccc" : "#666"} />
                        </TouchableOpacity>
                        
                        <Text style={styles.quantityText}>{quantity}</Text>
                        
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(drink.id, 1)}
                        >
                          <Ionicons name="add" size={16} color="#666" />
                        </TouchableOpacity>
                      </View>
                      
                      {/* Add Button */}
                      <TouchableOpacity
                        style={styles.addToLogButton}
                        onPress={() => handleCustomDrink(drink)}
                        disabled={loading}
                      >
                        <Ionicons name="add-circle" size={16} color="#ffffff" />
                        <Text style={styles.addToLogButtonText}>
                          {loading ? 'Adding...' : 'Add to Log'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Standard Drink Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#4169e1" />
            <Text style={styles.infoTitle}>About Standard Drinks</Text>
          </View>
          <Text style={styles.infoText}>
            A standard drink contains 14g of pure alcohol. We calculate this automatically based on volume and alcohol content (ABV).
          </Text>
        </View>
      </ScrollView>

      {/* Add Custom Drink Modal */}
      <Modal
        visible={showAddDrinkModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddDrinkModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Custom Drink</Text>
                <TouchableOpacity
                  onPress={() => setShowAddDrinkModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Drink Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={drinkForm.name}
                    onChangeText={(text) => setDrinkForm({...drinkForm, name: text})}
                    placeholder="e.g., My Favorite IPA"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Emoji</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
                    {emojiOptions.map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiOption,
                          drinkForm.emoji === emoji && styles.emojiOptionSelected
                        ]}
                        onPress={() => setDrinkForm({...drinkForm, emoji})}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Volume (ml) *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.volume}
                      onChangeText={(text) => setDrinkForm({...drinkForm, volume: text})}
                      placeholder="355"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>ABV (%) *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.abv}
                      onChangeText={(text) => setDrinkForm({...drinkForm, abv: text})}
                      placeholder="5.0"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Calories</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.calories}
                      onChangeText={(text) => setDrinkForm({...drinkForm, calories: text})}
                      placeholder="150"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Price ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.price}
                      onChangeText={(text) => setDrinkForm({...drinkForm, price: text})}
                      placeholder="5.00"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Notes (optional)</Text>
                  <TextInput
                    style={[styles.textInput, styles.textInputMultiline]}
                    value={drinkForm.notes}
                    onChangeText={(text) => setDrinkForm({...drinkForm, notes: text})}
                    placeholder="Any additional notes about this drink..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {drinkForm.volume && drinkForm.abv && (
                  <View style={styles.calculationResult}>
                    <Text style={styles.calculationText}>
                      This equals {calculateStandardDrinks(parseFloat(drinkForm.volume) || 0, parseFloat(drinkForm.abv) || 0).toFixed(2)} standard drinks
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddDrinkModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addDrinkButton}
                  onPress={handleAddNewDrink}
                  disabled={loading}
                >
                  <Text style={styles.addDrinkButtonText}>
                    {loading ? 'Adding...' : 'Save & Log'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Custom Drink Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Drink</Text>
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Drink Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={drinkForm.name}
                    onChangeText={(text) => setDrinkForm({...drinkForm, name: text})}
                    placeholder="e.g., My Favorite IPA"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Emoji</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
                    {emojiOptions.map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiOption,
                          drinkForm.emoji === emoji && styles.emojiOptionSelected
                        ]}
                        onPress={() => setDrinkForm({...drinkForm, emoji})}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Volume (ml) *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.volume}
                      onChangeText={(text) => setDrinkForm({...drinkForm, volume: text})}
                      placeholder="355"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>ABV (%) *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.abv}
                      onChangeText={(text) => setDrinkForm({...drinkForm, abv: text})}
                      placeholder="5.0"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Calories</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.calories}
                      onChangeText={(text) => setDrinkForm({...drinkForm, calories: text})}
                      placeholder="150"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Price ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.price}
                      onChangeText={(text) => setDrinkForm({...drinkForm, price: text})}
                      placeholder="5.00"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {drinkForm.volume && drinkForm.abv && (
                  <View style={styles.calculationResult}>
                    <Text style={styles.calculationText}>
                      This equals {calculateStandardDrinks(parseFloat(drinkForm.volume) || 0, parseFloat(drinkForm.abv) || 0).toFixed(2)} standard drinks
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addDrinkButton}
                  onPress={handleEditDrink}
                  disabled={loading}
                >
                  <Text style={styles.addDrinkButtonText}>
                    {loading ? 'Updating...' : 'Update Drink'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Quick Drink Modal */}
      <Modal
        visible={showEditQuickModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditQuickModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Customize Drink</Text>
                <TouchableOpacity
                  onPress={() => setShowEditQuickModal(false)}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Drink Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={drinkForm.name}
                    onChangeText={(text) => setDrinkForm({...drinkForm, name: text})}
                    placeholder="e.g., My Favorite Beer"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Emoji</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
                    {emojiOptions.map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiOption,
                          drinkForm.emoji === emoji && styles.emojiOptionSelected
                        ]}
                        onPress={() => setDrinkForm({...drinkForm, emoji})}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Volume (ml) *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.volume}
                      onChangeText={(text) => setDrinkForm({...drinkForm, volume: text})}
                      placeholder="355"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>ABV (%) *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.abv}
                      onChangeText={(text) => setDrinkForm({...drinkForm, abv: text})}
                      placeholder="5.0"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Calories</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.calories}
                      onChangeText={(text) => setDrinkForm({...drinkForm, calories: text})}
                      placeholder="150"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputGroupHalf}>
                    <Text style={styles.inputLabel}>Price ($)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={drinkForm.price}
                      onChangeText={(text) => setDrinkForm({...drinkForm, price: text})}
                      placeholder="5.00"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {drinkForm.volume && drinkForm.abv && (
                  <View style={styles.calculationResult}>
                    <Text style={styles.calculationText}>
                      This equals {calculateStandardDrinks(parseFloat(drinkForm.volume) || 0, parseFloat(drinkForm.abv) || 0).toFixed(2)} standard drinks
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditQuickModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addDrinkButton}
                  onPress={handleEditQuickDrink}
                  disabled={loading}
                >
                  <Text style={styles.addDrinkButtonText}>
                    {loading ? 'Updating...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* No Drinks Congratulations Modal */}
      <Modal
        visible={showNoDrinksCongrats}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowNoDrinksCongrats(false)}
      >
        <View style={styles.congratsOverlay}>
          <View style={styles.congratsModal}>
            <Text style={styles.congratsTitle}>Well done! 👏</Text>
            <View style={styles.congratsIconContainer}>
              <Text style={styles.congratsMainEmoji}>🎉</Text>
              <View style={styles.congratsSparks}>
                <Text style={[styles.congratsSpark, styles.spark1]}>✨</Text>
                <Text style={[styles.congratsSpark, styles.spark2]}>⭐</Text>
                <Text style={[styles.congratsSpark, styles.spark3]}>✨</Text>
              </View>
            </View>
            <View style={styles.congratsRewardBanner}>
              <Text style={styles.congratsRewardText}>
                😊 We're proud of you for staying strong! +25 Recoins
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, // Increased to account for status bar
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    paddingVertical: 20,
    paddingHorizontal: 32, // Extra wide horizontal padding to cover arrow tail
    marginLeft: -16, // Negative margin to extend touch area leftward
    marginRight: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginLeft: -32,
  },
  addButton: {
    backgroundColor: '#4169e1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4169e1',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#4169e1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 24,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  drinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  drinkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    paddingTop: 40, // Extra space for edit/delete buttons
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 220, // Increased height
    position: 'relative',
  },
  drinkCardActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e8ff',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  resetButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fffbeb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  drinkEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  drinkName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  drinkDetails: {
    fontSize: 12,
    color: '#4169e1',
    textAlign: 'center',
    marginBottom: 2,
  },
  drinkMeta: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  customizedLabel: {
    fontSize: 10,
    color: '#4169e1',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 8,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 12,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  addToLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4169e1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  addToLogButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#e0e8ff',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4169e1',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputGroupHalf: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  emojiScroll: {
    marginBottom: 4,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiOptionSelected: {
    borderColor: '#4169e1',
    backgroundColor: '#f0f4ff',
  },
  emojiText: {
    fontSize: 20,
  },
  calculationResult: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e8ff',
  },
  calculationText: {
    fontSize: 14,
    color: '#4169e1',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  addDrinkButton: {
    flex: 1,
    backgroundColor: '#4169e1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addDrinkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // No Drinks Today Button Styles
  noDrinksTodayButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noDrinksContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noDrinksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  noDrinksSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  noDrinksEmoji: {
    fontSize: 32,
  },
  noDrinksTodayButtonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.8,
  },
  // Congratulations Modal Styles
  congratsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  congratsModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: '100%',
  },
  congratsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  congratsIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  congratsMainEmoji: {
    fontSize: 60,
  },
  congratsSparks: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsSpark: {
    position: 'absolute',
    fontSize: 20,
  },
  spark1: {
    top: 0,
    left: -10,
  },
  spark2: {
    top: -5,
    right: -10,
  },
  spark3: {
    bottom: 0,
    left: 10,
  },
  congratsRewardBanner: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  congratsRewardText: {
    fontSize: 14,
    color: '#4a90e2',
    textAlign: 'center',
    fontWeight: '500',
  },
});