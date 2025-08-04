import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAlcoholTracking } from '@/hooks/use-alcohol-tracking';

const drinkTypes = [
  { id: 'beer', name: 'Beer', icon: 'beer-outline' },
  { id: 'wine', name: 'Wine', icon: 'wine-outline' },
  { id: 'spirits', name: 'Spirits', icon: 'flask-outline' },
  { id: 'cocktail', name: 'Cocktail', icon: 'color-palette-outline' },
];

const quickAmounts = [1, 2, 3, 4, 5];

export default function AddIntake() {
  const router = useRouter();
  const { addAlcoholLog } = useAlcoholTracking();
  
  const [selectedType, setSelectedType] = useState<string>('');
  const [amount, setAmount] = useState<string>('1');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleSelectAmount = (value: number) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(text)) {
      setCustomAmount(text);
      if (text) {
        setAmount(text);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Select Drink Type', 'Please select a type of drink');
      return;
    }

    const finalAmount = parseFloat(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await addAlcoholLog(finalAmount, selectedType);
      Alert.alert(
        'Intake Recorded',
        `${finalAmount} ${selectedType}${finalAmount > 1 ? 's' : ''} recorded`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to record intake. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Alcohol Intake</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Drink Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What did you drink?</Text>
          <View style={styles.drinkTypesGrid}>
            {drinkTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.drinkTypeCard,
                  selectedType === type.id && styles.drinkTypeCardSelected,
                ]}
                onPress={() => handleSelectType(type.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={type.icon as any}
                  size={32}
                  color={selectedType === type.id ? '#ffffff' : '#8B5CF6'}
                />
                <Text
                  style={[
                    styles.drinkTypeName,
                    selectedType === type.id && styles.drinkTypeNameSelected,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How many drinks?</Text>
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && !customAmount && styles.quickAmountButtonSelected,
                ]}
                onPress={() => handleSelectAmount(value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === value.toString() && !customAmount && styles.quickAmountTextSelected,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
            <TextInput
              style={styles.customAmountInput}
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              placeholder="0.0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
              maxLength={5}
            />
          </View>
        </View>

        {/* Current Selection Summary */}
        {selectedType && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Recording: {amount} {drinkTypes.find(t => t.id === selectedType)?.name}
              {parseFloat(amount) > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="#ffffff" />
              <Text style={styles.submitButtonText}>Record Intake</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
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
    paddingBottom: 120,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  drinkTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  drinkTypeCard: {
    width: '47%',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f8f9fa',
  },
  drinkTypeCardSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  drinkTypeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginTop: 8,
  },
  drinkTypeNameSelected: {
    color: '#ffffff',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f8f9fa',
  },
  quickAmountButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  quickAmountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  quickAmountTextSelected: {
    color: '#ffffff',
  },
  customAmountContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  customAmountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  customAmountInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    paddingVertical: 8,
  },
  summaryContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 30,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});