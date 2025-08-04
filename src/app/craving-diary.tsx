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

interface CravingEntry {
  id: string;
  date: string;
  time: string;
  trigger: string;
  intensity: number;
  duration: string;
  thoughts: string;
  actions: string;
  outcome: string;
}

export default function CravingDiary() {
  const router = useRouter();
  const [entries, setEntries] = useState<CravingEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [trigger, setTrigger] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [duration, setDuration] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [actions, setActions] = useState('');
  const [outcome, setOutcome] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('cravingEntries');
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading entries:', error);
    }
  };

  const saveEntry = async () => {
    if (!trigger.trim() || !thoughts.trim()) {
      Alert.alert('Missing Information', 'Please fill in at least the trigger and thoughts fields.');
      return;
    }

    const newEntry: CravingEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      trigger: trigger.trim(),
      intensity,
      duration: duration.trim() || 'Not specified',
      thoughts: thoughts.trim(),
      actions: actions.trim() || 'None recorded',
      outcome: outcome.trim() || 'Not specified',
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);

    try {
      await AsyncStorage.setItem('cravingEntries', JSON.stringify(updatedEntries));
      Alert.alert('Success', 'Craving entry saved successfully!');
      clearForm();
      setShowForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  const clearForm = () => {
    setTrigger('');
    setIntensity(5);
    setDuration('');
    setThoughts('');
    setActions('');
    setOutcome('');
  };

  const deleteEntry = async (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedEntries = entries.filter(entry => entry.id !== id);
            setEntries(updatedEntries);
            try {
              await AsyncStorage.setItem('cravingEntries', JSON.stringify(updatedEntries));
            } catch (error) {
              console.log('Error deleting entry:', error);
            }
          },
        },
      ]
    );
  };

  const getIntensityColor = (level: number) => {
    if (level <= 3) return '#4CAF50'; // Green
    if (level <= 6) return '#FF9800'; // Orange
    return '#F44336'; // Red
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
        <Text style={styles.headerTitle}>Craving Diary</Text>
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
            <Text style={styles.descriptionTitle}>Track Your Cravings</Text>
            <Text style={styles.descriptionText}>
              Recording your cravings helps identify patterns and triggers. This awareness is a powerful tool in your recovery journey.
            </Text>
          </View>

          {/* Add Entry Form */}
          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>New Craving Entry</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>What triggered this craving? *</Text>
                <TextInput
                  style={styles.textInput}
                  value={trigger}
                  onChangeText={setTrigger}
                  placeholder="e.g., stress at work, social event, boredom..."
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Intensity (1-10): {intensity}</Text>
                <View style={styles.intensitySlider}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.intensityButton,
                        { backgroundColor: intensity === level ? getIntensityColor(level) : '#f0f0f0' }
                      ]}
                      onPress={() => setIntensity(level)}
                    >
                      <Text style={[
                        styles.intensityText,
                        { color: intensity === level ? '#fff' : '#666' }
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>How long did it last?</Text>
                <TextInput
                  style={styles.textInput}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="e.g., 15 minutes, 2 hours..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>What thoughts went through your mind? *</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={thoughts}
                  onChangeText={setThoughts}
                  placeholder="Describe your thoughts and feelings..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>What actions did you take?</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={actions}
                  onChangeText={setActions}
                  placeholder="e.g., went for a walk, called a friend, used breathing exercises..."
                  multiline
                  numberOfLines={2}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>What was the outcome?</Text>
                <TextInput
                  style={styles.textInput}
                  value={outcome}
                  onChangeText={setOutcome}
                  placeholder="e.g., craving passed, I drank, I distracted myself..."
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
                  onPress={saveEntry}
                >
                  <Text style={styles.saveButtonText}>Save Entry</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Entries List */}
          <View style={styles.entriesSection}>
            <Text style={styles.sectionTitle}>
              Recent Entries ({entries.length})
            </Text>
            
            {entries.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No entries yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Tap the + button to record your first craving
                </Text>
              </View>
            ) : (
              entries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryDate}>{entry.date} at {entry.time}</Text>
                      <View style={styles.intensityBadge}>
                        <View 
                          style={[
                            styles.intensityDot, 
                            { backgroundColor: getIntensityColor(entry.intensity) }
                          ]} 
                        />
                        <Text style={styles.intensityLabel}>
                          Intensity: {entry.intensity}/10
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteEntry(entry.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#999" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.entryContent}>
                    <Text style={styles.entryLabel}>Trigger:</Text>
                    <Text style={styles.entryText}>{entry.trigger}</Text>
                    
                    <Text style={styles.entryLabel}>Thoughts:</Text>
                    <Text style={styles.entryText}>{entry.thoughts}</Text>
                    
                    {entry.actions !== 'None recorded' && (
                      <>
                        <Text style={styles.entryLabel}>Actions taken:</Text>
                        <Text style={styles.entryText}>{entry.actions}</Text>
                      </>
                    )}
                    
                    <View style={styles.entryFooter}>
                      <Text style={styles.entryDetail}>Duration: {entry.duration}</Text>
                      <Text style={styles.entryDetail}>Outcome: {entry.outcome}</Text>
                    </View>
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
  intensitySlider: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intensityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityText: {
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
  entriesSection: {
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
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 4,
  },
  entryContent: {
    gap: 8,
  },
  entryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4169e1',
    marginTop: 4,
  },
  entryText: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  entryDetail: {
    fontSize: 12,
    color: '#999',
  },
});