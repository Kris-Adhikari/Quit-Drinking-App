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

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction{'\n'}</Text>
          <Text style={styles.sectionText}>
            Deriv ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and share information about you when you use our 
            alcohol tracking mobile application.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect{'\n'}</Text>
          <Text style={styles.sectionText}>
            We collect the following types of information:{'\n\n'}
            
            • <Text style={styles.bold}>Personal Information:</Text> Name, email address, and profile information you provide{'\n'}
            • <Text style={styles.bold}>Usage Data:</Text> Alcohol consumption logs, goals, streaks, and progress data{'\n'}
            • <Text style={styles.bold}>Device Information:</Text> Device identifiers, operating system, app version{'\n'}
            • <Text style={styles.bold}>Analytics Data:</Text> App usage patterns and crash reports (only if you consent){'\n'}
            • <Text style={styles.bold}>Location Data:</Text> Only if you explicitly grant permission for location-based features
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information{'\n'}</Text>
          <Text style={styles.sectionText}>
            We use your information to:{'\n\n'}
            
            • Provide and improve our alcohol tracking services{'\n'}
            • Store your progress and sync across devices{'\n'}
            • Send notifications and reminders (only if enabled){'\n'}
            • Provide customer support{'\n'}
            • Analyze app usage to improve features{'\n'}
            • Ensure app security and prevent fraud
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing{'\n'}</Text>
          <Text style={styles.sectionText}>
            We do not sell your personal data. We may share data only in these limited circumstances:{'\n\n'}
            
            • <Text style={styles.bold}>With your consent:</Text> When you explicitly agree to share data{'\n'}
            • <Text style={styles.bold}>Service providers:</Text> Trusted third parties who help operate our app (e.g., cloud storage, analytics){'\n'}
            • <Text style={styles.bold}>Legal requirements:</Text> When required by law or to protect our rights{'\n'}
            • <Text style={styles.bold}>Business transfers:</Text> In case of merger or sale of our company
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security{'\n'}</Text>
          <Text style={styles.sectionText}>
            We implement appropriate security measures to protect your data, including:{'\n\n'}
            
            • Encryption of data in transit and at rest{'\n'}
            • Secure authentication systems{'\n'}
            • Regular security audits{'\n'}
            • Limited access to personal data{'\n'}
            • Secure cloud storage with reputable providers
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights{'\n'}</Text>
          <Text style={styles.sectionText}>
            You have the right to:{'\n\n'}
            
            • <Text style={styles.bold}>Access:</Text> Request a copy of your personal data{'\n'}
            • <Text style={styles.bold}>Correct:</Text> Update inaccurate information{'\n'}
            • <Text style={styles.bold}>Delete:</Text> Request deletion of your account and data{'\n'}
            • <Text style={styles.bold}>Export:</Text> Download your data in a portable format{'\n'}
            • <Text style={styles.bold}>Withdraw consent:</Text> Opt out of data collection or processing{'\n'}
            • <Text style={styles.bold}>Object:</Text> Object to certain types of data processing
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention{'\n'}</Text>
          <Text style={styles.sectionText}>
            We retain your data for as long as your account is active or as needed to provide services. 
            When you delete your account, we will delete your personal data within 30 days, except where 
            we are required to retain it for legal purposes.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy{'\n'}</Text>
          <Text style={styles.sectionText}>
            Our app is not intended for children under 13. We do not knowingly collect personal information 
            from children under 13. If you believe we have collected information from a child under 13, 
            please contact us immediately.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>International Data Transfers{'\n'}</Text>
          <Text style={styles.sectionText}>
            Your data may be processed in countries other than where you live. We ensure appropriate 
            safeguards are in place to protect your data during international transfers.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy{'\n'}</Text>
          <Text style={styles.sectionText}>
            We may update this privacy policy from time to time. We will notify you of significant 
            changes by posting the new policy in the app and updating the "Last updated" date.
          </Text>
        </Text>

        <Text style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us{'\n'}</Text>
          <Text style={styles.sectionText}>
            If you have questions about this privacy policy or your data, contact us at:{'\n\n'}
            
            Email: privacy@deriv-app.com{'\n'}
            Address: [Your Company Address]{'\n'}
            
            For EU residents, you may also contact our Data Protection Officer at dpo@deriv-app.com
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
});