import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Moon, Clock, User, Shield, CircleHelp as HelpCircle, Info, ChevronRight, X, Save, Download, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useCycle } from '@/contexts/CycleContext';

// Standard Android phone dimensions
const PHONE_WIDTH = 360;

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [cycleTracking, setCycleTracking] = useState(true);
  
  // Modal states
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [customTimerModalVisible, setCustomTimerModalVisible] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
  });
  
  // Custom timer form state
  const [customTimerForm, setCustomTimerForm] = useState({
    hours: '',
    useCustom: false,
  });
  
  const { user, logout } = useAuth();
  const { customHours, setCustomHours, getEffectiveHours, isUsingCustomTimer, getCurrentPhaseData } = useCycle();

  React.useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        age: '',
        weight: '',
        height: '',
      });
    }
  }, [user]);

  React.useEffect(() => {
    setCustomTimerForm({
      hours: customHours?.toString() || '',
      useCustom: isUsingCustomTimer,
    });
  }, [customHours, isUsingCustomTimer]);
  const handleFastingSchedule = () => {
    setScheduleModalVisible(true);
  };

  const handleCustomTimer = () => {
    setCustomTimerModalVisible(true);
  };
  const handleProfile = () => {
    setProfileModalVisible(true);
  };

  const handlePrivacy = () => {
    setPrivacyModalVisible(true);
  };

  const handleHelp = () => {
    setHelpModalVisible(true);
  };

  const handleAbout = () => {
    setAboutModalVisible(true);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your fasting data has been prepared for export. In a real app, this would download a CSV or JSON file with your fasting history.',
      [{ text: 'OK' }]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your fasting records, progress, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Data Reset', 'All data has been reset successfully.');
          }
        },
      ]
    );
  };

  const saveProfile = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    setProfileModalVisible(false);
  };

  const saveCustomTimer = () => {
    if (customTimerForm.useCustom) {
      const hours = parseFloat(customTimerForm.hours);
      if (isNaN(hours) || hours < 8 || hours > 24) {
        Alert.alert('Invalid Hours', 'Please enter a valid number between 8 and 24 hours.');
        return;
      }
      setCustomHours(hours);
      Alert.alert('Timer Updated', `Custom timer set to ${hours} hours.`);
    } else {
      setCustomHours(null);
      Alert.alert('Timer Reset', 'Using cycle-synced recommendations.');
    }
    setCustomTimerModalVisible(false);
  };

  const settingsGroups = [
    {
      title: 'Fasting Settings',
      items: [
        {
          icon: Clock,
          label: 'Fasting Schedule',
          description: isUsingCustomTimer 
            ? `${getEffectiveHours()}h Custom Timer`
            : `${getCurrentPhaseData().fastingWindow} Cycle-Synced`,
          action: 'function',
          onPress: handleFastingSchedule,
        },
        {
          icon: Clock,
          label: 'Custom Timer',
          description: isUsingCustomTimer 
            ? `Set to ${customHours}h` 
            : 'Use your own fasting duration',
          action: 'function',
          onPress: handleCustomTimer,
        },
        {
          icon: Bell,
          label: 'Reminders',
          description: 'Get notified when to start/stop fasting',
          action: 'toggle',
          value: reminderEnabled,
          onToggle: setReminderEnabled,
        },
        {
          icon: Moon,
          label: 'Cycle Tracking',
          description: 'Sync fasting with menstrual cycle',
          action: 'toggle',
          value: cycleTracking,
          onToggle: setCycleTracking,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Push notifications',
          action: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Enable dark theme',
          action: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: 'Account & Privacy',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: 'Manage your account',
          action: 'function',
          onPress: handleProfile,
        },
        {
          icon: Shield,
          label: 'Privacy',
          description: 'Data and privacy settings',
          action: 'function',
          onPress: handlePrivacy,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          description: 'Get help with the app',
          action: 'function',
          onPress: handleHelp,
        },
        {
          icon: Info,
          label: 'About',
          description: 'App version and info',
          action: 'function',
          onPress: handleAbout,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity 
        key={item.label} 
        style={styles.settingItem}
        onPress={item.onPress}
      >
        <View style={styles.settingIcon}>
          <IconComponent size={24} color="#E91E63" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
        <View style={styles.settingAction}>
          {item.action === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: '#374151', true: '#E91E63' }}
              thumbColor={item.value ? '#FFFFFF' : '#9CA3AF'}
            />
          ) : (
            <ChevronRight size={20} color="#6B7280" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>FAST 168</Text>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your fasting experience</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleProfile}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {settingsGroups.map((group, groupIndex) => (
            <View key={groupIndex} style={styles.settingsGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupItems}>
                {group.items.map(renderSettingItem)}
              </View>
            </View>
          ))}

          <View style={styles.dangerZone}>
            <Text style={styles.groupTitle}>Data</Text>
            <View style={styles.groupItems}>
              <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
                <View style={styles.settingIcon}>
                  <Download size={24} color="#E91E63" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>Export Data</Text>
                  <Text style={styles.settingDescription}>Download your fasting data</Text>
                </View>
                <ChevronRight size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
                <View style={styles.settingIcon}>
                  <Trash2 size={24} color="#EF4444" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, styles.dangerText]}>Reset All Data</Text>
                  <Text style={styles.settingDescription}>This cannot be undone</Text>
                </View>
                <ChevronRight size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem} onPress={logout}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, styles.dangerText]}>Sign Out</Text>
                  <Text style={styles.settingDescription}>Sign out of your account</Text>
                </View>
                <ChevronRight size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Fast Like a Girl v1.0.0</Text>
            <Text style={styles.footerSubtext}>
              Empowering women through cycle-synced fasting
            </Text>
          </View>
        </ScrollView>

        {/* Profile Modal */}
        <Modal
          visible={profileModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setProfileModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Name</Text>
                  <TextInput
                    style={styles.formInput}
                    value={profileForm.name}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, name: text }))}
                    placeholder="Enter your name"
                    placeholderTextColor="#6B7280"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Email</Text>
                  <TextInput
                    style={styles.formInput}
                    value={profileForm.email}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, email: text }))}
                    placeholder="Enter your email"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Age</Text>
                  <TextInput
                    style={styles.formInput}
                    value={profileForm.age}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, age: text }))}
                    placeholder="Enter your age"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Weight (lbs)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={profileForm.weight}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, weight: text }))}
                    placeholder="Enter your weight"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Height (ft)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={profileForm.height}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, height: text }))}
                    placeholder="Enter your height"
                    placeholderTextColor="#6B7280"
                  />
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Fasting Schedule Modal */}
        <Modal
          visible={scheduleModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setScheduleModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Fasting Schedule</Text>
                <TouchableOpacity onPress={() => setScheduleModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.scheduleContent}>
                <Text style={styles.scheduleText}>Current Schedule: 16:8 Intermittent Fasting</Text>
                <Text style={styles.scheduleDescription}>
                  Fast for 16 hours, eat within an 8-hour window. This schedule is automatically adjusted based on your menstrual cycle phase.
                </Text>
                <View style={styles.scheduleOptions}>
                  {['12:12', '14:10', '16:8', '18:6', '20:4'].map((schedule) => (
                    <TouchableOpacity key={schedule} style={styles.scheduleOption}>
                      <Text style={styles.scheduleOptionText}>{schedule}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Timer Modal */}
        <Modal
          visible={customTimerModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCustomTimerModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Custom Timer</Text>
                <TouchableOpacity onPress={() => setCustomTimerModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.customTimerContent}>
                <Text style={styles.customTimerDescription}>
                  Set your own fasting duration or use cycle-synced recommendations that automatically adjust based on your menstrual cycle phase.
                </Text>
                
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>Use Custom Timer</Text>
                  <Switch
                    value={customTimerForm.useCustom}
                    onValueChange={(value) => setCustomTimerForm(prev => ({ ...prev, useCustom: value }))}
                    trackColor={{ false: '#374151', true: '#E91E63' }}
                    thumbColor={customTimerForm.useCustom ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
                
                {customTimerForm.useCustom && (
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Fasting Hours</Text>
                    <TextInput
                      style={styles.formInput}
                      value={customTimerForm.hours}
                      onChangeText={(text) => setCustomTimerForm(prev => ({ ...prev, hours: text }))}
                      placeholder="16"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                    />
                    <Text style={styles.formHint}>Enter hours between 8 and 24</Text>
                  </View>
                )}
                
                {!customTimerForm.useCustom && (
                  <View style={styles.cycleInfo}>
                    <Text style={styles.cycleInfoTitle}>Cycle-Synced Recommendations</Text>
                    <Text style={styles.cycleInfoText}>
                      Your fasting window will automatically adjust based on your current menstrual cycle phase for optimal hormonal balance and energy levels.
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={saveCustomTimer}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Privacy Modal */}
        <Modal
          visible={privacyModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setPrivacyModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Privacy Settings</Text>
                <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.privacyContent}>
                <Text style={styles.privacyTitle}>Data Collection</Text>
                <Text style={styles.privacyText}>
                  We collect only the data necessary to provide you with personalized fasting recommendations and track your progress.
                </Text>
                <Text style={styles.privacyTitle}>Data Storage</Text>
                <Text style={styles.privacyText}>
                  Your data is stored securely and is never shared with third parties without your explicit consent.
                </Text>
                <Text style={styles.privacyTitle}>Your Rights</Text>
                <Text style={styles.privacyText}>
                  You have the right to access, modify, or delete your personal data at any time through the app settings.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Help Modal */}
        <Modal
          visible={helpModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setHelpModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Help & FAQ</Text>
                <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.helpContent}>
                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>How does cycle-synced fasting work?</Text>
                  <Text style={styles.faqAnswer}>
                    The app adjusts your fasting window based on your menstrual cycle phase to optimize hormonal balance and energy levels.
                  </Text>
                </View>
                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>What if I break my fast early?</Text>
                  <Text style={styles.faqAnswer}>
                    That's okay! Mark it as incomplete in your calendar and try again tomorrow. Listen to your body.
                  </Text>
                </View>
                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>Can I change my fasting schedule?</Text>
                  <Text style={styles.faqAnswer}>
                    Yes, you can adjust your schedule in the Fasting Schedule settings, though we recommend following cycle-synced recommendations.
                  </Text>
                </View>
                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>How do I track my cycle?</Text>
                  <Text style={styles.faqAnswer}>
                    Go to the Cycle tab and select your current phase. The app will automatically adjust your fasting recommendations.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* About Modal */}
        <Modal
          visible={aboutModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAboutModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>About Fast Like a Girl</Text>
                <TouchableOpacity onPress={() => setAboutModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.aboutContent}>
                <Text style={styles.aboutTitle}>Version 1.0.0</Text>
                <Text style={styles.aboutText}>
                  Fast Like a Girl is designed specifically for women who want to optimize their intermittent fasting practice by syncing it with their menstrual cycle.
                </Text>
                <Text style={styles.aboutTitle}>Features</Text>
                <Text style={styles.aboutText}>
                  • Cycle-synced fasting recommendations{'\n'}
                  • Real-time fasting timer{'\n'}
                  • Progress tracking and analytics{'\n'}
                  • Daily fasting calendar{'\n'}
                  • Educational fasting phases
                </Text>
                <Text style={styles.aboutTitle}>Support</Text>
                <Text style={styles.aboutText}>
                  For support or feedback, please contact us through the Help & FAQ section.
                </Text>
                <Text style={styles.aboutTitle}>Credits</Text>
                <Text style={styles.aboutText}>
                  Built with React Native and Expo. Inspired by the principles of hormone-friendly fasting for women.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: PHONE_WIDTH,
    alignSelf: 'center',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#E91E63',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
    textAlign: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
  },
  editButton: {
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
  settingsGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  groupItems: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
  },
  settingAction: {
    marginLeft: 16,
  },
  dangerZone: {
    marginBottom: 30,
  },
  dangerText: {
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    textAlign: 'center',
  },
  signOutButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  modalForm: {
    paddingHorizontal: 20,
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  scheduleContent: {
    padding: 20,
  },
  scheduleText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scheduleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
    marginBottom: 20,
  },
  scheduleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scheduleOption: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  scheduleOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
  privacyContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
    marginBottom: 12,
  },
  helpContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
  },
  aboutContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  aboutTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 16,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
    marginBottom: 12,
  },
  customTimerContent: {
    paddingHorizontal: 20,
    flex: 1,
  },
  customTimerDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  formHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  cycleInfo: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  cycleInfoTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cycleInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
  },
});