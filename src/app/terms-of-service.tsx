import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsOfService() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Acceptance of Terms{'\n'}</Text>
          <Text style={styles.sectionText}>
            By downloading, installing, or using the Deriv mobile application ("App"), you agree to be bound 
            by these Terms of Service ("Terms"). If you do not agree to these terms, please do not use our App.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Description of Service{'\n'}</Text>
          <Text style={styles.sectionText}>
            Deriv is a mobile application designed to help users track and manage their alcohol consumption. 
            The App provides features including but not limited to:{'\n\n'}
            
            • Alcohol consumption logging and tracking{'\n'}
            • Progress monitoring and streak tracking{'\n'}
            • Goal setting and achievement tracking{'\n'}
            • Educational content and resources{'\n'}
            • Personalized insights and statistics
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Disclaimer{'\n'}</Text>
          <Text style={styles.sectionText}>
            <Text style={styles.important}>IMPORTANT:</Text> This App is for informational and tracking purposes only 
            and is not intended to provide medical advice, diagnosis, or treatment. The App is not a substitute 
            for professional medical advice or treatment.{'\n\n'}
            
            • Always consult with healthcare professionals for medical concerns{'\n'}
            • Seek immediate medical attention for alcohol withdrawal or related health issues{'\n'}
            • Do not rely solely on this App for addiction recovery{'\n'}
            • If you are experiencing severe alcohol dependency, contact healthcare providers immediately
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>User Accounts{'\n'}</Text>
          <Text style={styles.sectionText}>
            To use certain features, you may need to create an account. You agree to:{'\n\n'}
            
            • Provide accurate and complete information{'\n'}
            • Keep your login credentials secure{'\n'}
            • Notify us of any unauthorized use of your account{'\n'}
            • Take responsibility for all activities under your account{'\n'}
            • Not share your account with others
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>User Conduct{'\n'}</Text>
          <Text style={styles.sectionText}>
            You agree not to:{'\n\n'}
            
            • Use the App for any illegal purposes{'\n'}
            • Attempt to hack, reverse engineer, or compromise the App{'\n'}
            • Upload false or misleading information{'\n'}
            • Interfere with other users' experience{'\n'}
            • Violate any applicable laws or regulations{'\n'}
            • Use the App to harm yourself or others
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription and Payments{'\n'}</Text>
          <Text style={styles.sectionText}>
            Some features may require a paid subscription:{'\n\n'}
            
            • <Text style={styles.bold}>Payment:</Text> Subscriptions are charged through your App Store account{'\n'}
            • <Text style={styles.bold}>Auto-renewal:</Text> Subscriptions automatically renew unless cancelled{'\n'}
            • <Text style={styles.bold}>Cancellation:</Text> You can cancel anytime through your device's subscription settings{'\n'}
            • <Text style={styles.bold}>Refunds:</Text> Refunds are subject to App Store policies{'\n'}
            • <Text style={styles.bold}>Price changes:</Text> We may change subscription prices with advance notice
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Data and Privacy{'\n'}</Text>
          <Text style={styles.sectionText}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
            your information. By using the App, you consent to data collection and use as described in our 
            Privacy Policy.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Intellectual Property{'\n'}</Text>
          <Text style={styles.sectionText}>
            The App and its content are protected by intellectual property laws:{'\n\n'}
            
            • <Text style={styles.bold}>Our rights:</Text> We own all rights to the App, design, and content{'\n'}
            • <Text style={styles.bold}>Your license:</Text> We grant you a limited license to use the App for personal purposes{'\n'}
            • <Text style={styles.bold}>Restrictions:</Text> You may not copy, modify, or distribute the App{'\n'}
            • <Text style={styles.bold}>Your data:</Text> You retain ownership of your personal tracking data
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Disclaimers{'\n'}</Text>
          <Text style={styles.sectionText}>
            THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND:{'\n\n'}
            
            • We do not guarantee the App will be error-free or uninterrupted{'\n'}
            • We are not responsible for data loss or device damage{'\n'}
            • The App may not be suitable for all users{'\n'}
            • Results and effectiveness may vary by individual
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Limitation of Liability{'\n'}</Text>
          <Text style={styles.sectionText}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:{'\n\n'}
            
            • We are not liable for indirect, incidental, or consequential damages{'\n'}
            • Our total liability shall not exceed the amount you paid for the App{'\n'}
            • We are not liable for health-related decisions based on App use{'\n'}
            • Some jurisdictions do not allow liability limitations, so these may not apply to you
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Termination{'\n'}</Text>
          <Text style={styles.sectionText}>
            We may terminate or suspend your access if you violate these Terms. Upon termination:{'\n\n'}
            
            • Your right to use the App ends immediately{'\n'}
            • We may delete your account and data{'\n'}
            • You remain liable for any charges incurred{'\n'}
            • Certain provisions of these Terms survive termination
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to Terms{'\n'}</Text>
          <Text style={styles.sectionText}>
            We may modify these Terms at any time. Changes will be effective when posted in the App. 
            Your continued use after changes constitutes acceptance of the new Terms.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Governing Law{'\n'}</Text>
          <Text style={styles.sectionText}>
            These Terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved 
            in the courts of [Your Jurisdiction].
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information{'\n'}</Text>
          <Text style={styles.sectionText}>
            If you have questions about these Terms, contact us at:{'\n\n'}
            
            Email: legal@deriv-app.com{'\n'}
            Address: [Your Company Address]{'\n'}
            Support: support@deriv-app.com
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Severability{'\n'}</Text>
          <Text style={styles.sectionText}>
            If any provision of these Terms is found unenforceable, the remaining provisions remain in full force and effect.
          </Text>
        </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
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
    paddingVertical: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  bold: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  important: {
    fontWeight: '700',
    color: '#FF3B30',
  },
});