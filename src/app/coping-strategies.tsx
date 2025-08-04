import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CopingStrategy {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  effectiveness: number;
  category: string;
  notes: string;
}

const categories = [
  'Physical Activity',
  'Mindfulness',
  'Social Support',
  'Distraction',
  'Self-Care',
  'Creative',
  'Problem-Solving',
  'Other'
];

export default function CopingStrategies() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [effectiveness, setEffectiveness] = useState(5);
  const [category, setCategory] = useState(categories[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const stored = await AsyncStorage.getItem('copingStrategies');
      if (stored) {
        setStrategies(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading strategies:', error);
    }
  };

  const saveStrategy = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in at least the title and description fields.');
      return;
    }

    const newStrategy: CopingStrategy = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: title.trim(),
      description: description.trim(),
      effectiveness,
      category,
      notes: notes.trim() || 'No additional notes',
    };

    const updatedStrategies = [newStrategy, ...strategies];
    setStrategies(updatedStrategies);

    try {
      await AsyncStorage.setItem('copingStrategies', JSON.stringify(updatedStrategies));
      Alert.alert('Success', 'Coping strategy saved successfully!');
      clearForm();
      setShowForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save strategy. Please try again.');
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setEffectiveness(5);
    setCategory(categories[0]);
    setNotes('');
  };

  const deleteStrategy = async (id: string) => {
    Alert.alert(
      'Delete Strategy',
      'Are you sure you want to delete this coping strategy?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedStrategies = strategies.filter(strategy => strategy.id !== id);
            setStrategies(updatedStrategies);
            try {
              await AsyncStorage.setItem('copingStrategies', JSON.stringify(updatedStrategies));
            } catch (error) {
              console.log('Error deleting strategy:', error);
            }
          },
        },
      ]
    );
  };

  const getEffectivenessColor = (level: number) => {
    if (level <= 3) return '#F44336'; // Red
    if (level <= 6) return '#FF9800'; // Orange
    return '#4CAF50'; // Green
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Physical Activity': '#4CAF50',
      'Mindfulness': '#9C27B0',
      'Social Support': '#2196F3',
      'Distraction': '#FF9800',
      'Self-Care': '#E91E63',
      'Creative': '#9E9E9E',
      'Problem-Solving': '#795548',
      'Other': '#607D8B',
    };
    return colors[cat] || '#607D8B';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coping Strategies</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Ionicons name={showForm ? "close" : "add"} size={24} color="#4169e1" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionTitle}>Build Your Toolkit</Text>
            <Text style={styles.descriptionText}>
              Document strategies that help you cope with cravings and difficult emotions. Rate their effectiveness to build your personal toolkit of healthy responses.
            </Text>
          </View>

          {/* Add Strategy Form */}
          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Coping Strategy</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Strategy Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Deep breathing exercise, Call a friend..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categorySelector}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryButton,
                          { 
                            backgroundColor: category === cat ? getCategoryColor(cat) : '#f0f0f0',
                            borderColor: getCategoryColor(cat),
                          }
                        ]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text style={[
                          styles.categoryText,
                          { color: category === cat ? '#fff' : getCategoryColor(cat) }
                        ]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Describe how to use this strategy, when it works best, what makes it effective..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Effectiveness (1-10): {effectiveness}</Text>
                <View style={styles.effectivenessSlider}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.effectivenessButton,
                        { backgroundColor: effectiveness === level ? getEffectivenessColor(level) : '#f0f0f0' }
                      ]}
                      onPress={() => setEffectiveness(level)}
                    >
                      <Text style={[
                        styles.effectivenessText,
                        { color: effectiveness === level ? '#fff' : '#666' }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Additional Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional thoughts, modifications, or observations..."
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    clearForm();
                    setShowForm(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={saveStrategy}
                >
                  <Text style={styles.saveButtonText}>Save Strategy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Strategies List */}
          <View style={styles.strategiesSection}>
            <Text style={styles.sectionTitle}>
              Your Strategies ({strategies.length})
            </Text>
            
            {strategies.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bulb-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No strategies yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Tap the + button to add your first coping strategy
                </Text>
              </View>
            ) : (
              strategies.map((strategy) => (
                <View key={strategy.id} style={styles.strategyCard}>
                  <View style={styles.strategyHeader}>
                    <View style={styles.strategyHeaderLeft}>
                      <View style={styles.categoryBadge}>
                        <View 
                          style={[
                            styles.categoryDot, 
                            { backgroundColor: getCategoryColor(strategy.category) }
                          ]} 
                        />
                        <Text style={styles.categoryLabel}>{strategy.category}</Text>
                      </View>
                      <Text style={styles.strategyDate}>{strategy.date} at {strategy.time}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteStrategy(strategy.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#999" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.strategyContent}>
                    <Text style={styles.strategyTitle}>{strategy.title}</Text>
                    <Text style={styles.strategyDescription}>{strategy.description}</Text>
                    
                    <View style={styles.strategyFooter}>
                      <View style={styles.effectivenessBadge}>
                        <View 
                          style={[
                            styles.effectivenessDot, 
                            { backgroundColor: getEffectivenessColor(strategy.effectiveness) }
                          ]} 
                        />
                        <Text style={styles.effectivenessLabel}>
                          Effectiveness: {strategy.effectiveness}/10
                        </Text>
                      </View>
                    </View>
                    
                    {strategy.notes !== 'No additional notes' && (
                      <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{strategy.notes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f9f9f9',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  effectivenessSlider: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  effectivenessButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  effectivenessText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4169e1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  strategiesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
  strategyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  strategyHeaderLeft: {
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  strategyDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  strategyContent: {
    gap: 8,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  strategyDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  strategyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  effectivenessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  effectivenessDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  effectivenessLabel: {
    fontSize: 12,
    color: '#666',
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4169e1',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});