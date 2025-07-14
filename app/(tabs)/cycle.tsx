import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Moon, Sun, Flower, Heart, CircleAlert as AlertCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCycle } from '@/contexts/CycleContext';

// Standard Android phone dimensions
const PHONE_WIDTH = 360;

export default function CycleScreen() {
  const { selectedPhase, setSelectedPhase } = useCycle();
  
  const cyclePhases = {
    menstrual: {
      name: 'Menstrual Phase',
      days: '1-7',
      icon: Moon,
      color: '#DC2626',
      recommendedHours: 12,
      fastingWindow: '12:12',
      description: 'Rest and gentle fasting',
      fastingTips: [
        'Shorter fasting windows (12-14 hours)',
        'Focus on nutrient-dense foods',
        'Stay hydrated and get extra rest',
        'Gentle movement and self-care'
      ],
      benefits: ['Gentle detox', 'Reduced inflammation', 'Better sleep']
    },
    follicular: {
      name: 'Follicular Phase',
      days: '1-13',
      icon: Flower,
      color: '#10B981',
      recommendedHours: 16,
      fastingWindow: '16:8',
      description: 'Building energy phase',
      fastingTips: [
        'Standard 16:8 fasting works well',
        'Increase protein and healthy fats',
        'Great time for new challenges',
        'Higher intensity workouts'
      ],
      benefits: ['Increased energy', 'Better focus', 'Muscle building']
    },
    ovulation: {
      name: 'Ovulation Phase',
      days: '14',
      icon: Sun,
      color: '#F59E0B',
      recommendedHours: 18,
      fastingWindow: '18:6',
      description: 'Peak energy and metabolism',
      fastingTips: [
        'Longer fasting windows (16-18 hours)',
        'Optimal fat burning window',
        'High-intensity workouts',
        'Social activities and challenges'
      ],
      benefits: ['Peak metabolism', 'Maximum fat burn', 'High energy']
    },
    luteal: {
      name: 'Luteal Phase',
      days: '15-28',
      icon: Heart,
      color: '#8B5CF6',
      recommendedHours: 14,
      fastingWindow: '14:10',
      description: 'Prepare for next cycle',
      fastingTips: [
        'Flexible fasting windows (14-16 hours)',
        'Increase complex carbs',
        'Stress management priority',
        'Gentle yoga and walks'
      ],
      benefits: ['Hormone balance', 'Reduced cravings', 'Better mood']
    }
  };

  const currentPhase = cyclePhases[selectedPhase];
  const IconComponent = currentPhase.icon;

  const tips = [
    {
      title: 'Track Your Cycle',
      description: 'Monitor your menstrual cycle to optimize fasting windows',
      icon: Calendar,
    },
    {
      title: 'Listen to Your Body',
      description: 'Adjust fasting based on how you feel each day',
      icon: Heart,
    },
    {
      title: 'Hormone-Friendly Foods',
      description: 'Focus on nutrient-dense foods that support hormonal health',
      icon: Flower,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>FAST 168</Text>
            <Text style={styles.title}>Cycle-Synced Fasting</Text>
            <Text style={styles.subtitle}>Optimize your fasting with your cycle</Text>
          </View>

          <View style={styles.phaseSelector}>
            <Text style={styles.sectionTitle}>Select Your Current Phase</Text>
            <View style={styles.phaseGrid}>
              {Object.entries(cyclePhases).map(([key, phase]) => {
                const PhaseIcon = phase.icon;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.phaseButton,
                      selectedPhase === key && styles.phaseButtonActive,
                      { borderColor: selectedPhase === key ? phase.color : 'transparent' }
                    ]}
                    onPress={() => setSelectedPhase(key as any)}>
                    <PhaseIcon size={24} color={phase.color} />
                    <Text style={[
                      styles.phaseButtonText,
                      selectedPhase === key && styles.phaseButtonTextActive
                    ]}>
                      {phase.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.currentPhaseContainer}>
            <View style={styles.phaseHeader}>
              <IconComponent size={32} color={currentPhase.color} />
              <View style={styles.phaseInfo}>
                <Text style={styles.phaseName}>{currentPhase.name}</Text>
                <Text style={styles.phaseDays}>Days {currentPhase.days}</Text>
              </View>
            </View>
            
            <Text style={styles.phaseDescription}>{currentPhase.description}</Text>
            
            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationTitle}>Today's Recommendation</Text>
              <View style={styles.recommendationCard}>
                <View style={styles.recommendationMain}>
                  <Text style={styles.recommendationHours}>{currentPhase.recommendedHours}h</Text>
                  <Text style={styles.recommendationLabel}>Fasting Window</Text>
                </View>
                <View style={styles.recommendationDetails}>
                  <Text style={styles.fastingWindow}>{currentPhase.fastingWindow}</Text>
                  <Text style={styles.windowLabel}>Fast : Eat</Text>
                </View>
              </View>
              <Text style={styles.recommendationNote}>
                Optimal fasting duration for your current cycle phase
              </Text>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => {
                  // The timer will automatically update via context
                }}>
                <Text style={styles.applyButtonText}>
                  Timer Updated to {currentPhase.recommendedHours}h
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits</Text>
              <View style={styles.benefitsList}>
                {currentPhase.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <View style={[styles.benefitDot, { backgroundColor: currentPhase.color }]} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Fasting Tips for This Phase</Text>
            {currentPhase.fastingTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={[styles.tipIndicator, { backgroundColor: currentPhase.color }]} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.generalTipsContainer}>
            <Text style={styles.sectionTitle}>General Guidelines</Text>
            {tips.map((tip, index) => {
              const TipIcon = tip.icon;
              return (
                <View key={index} style={styles.generalTipCard}>
                  <View style={styles.tipIconContainer}>
                    <TipIcon size={24} color="#E91E63" />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.noteContainer}>
            <AlertCircle size={20} color="#F59E0B" />
            <Text style={styles.noteText}>
              Remember: Every woman's cycle is different. Listen to your body and adjust accordingly.
            </Text>
          </View>
        </ScrollView>
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
  phaseSelector: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  phaseButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  phaseButtonActive: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
  },
  phaseButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
    marginTop: 8,
  },
  phaseButtonTextActive: {
    color: '#FFFFFF',
  },
  currentPhaseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phaseInfo: {
    marginLeft: 16,
  },
  phaseName: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  phaseDays: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
  },
  phaseDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 24,
  },
  recommendationContainer: {
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
    marginBottom: 8,
  },
  recommendationMain: {
    flex: 1,
    alignItems: 'center',
  },
  recommendationHours: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#E91E63',
    marginBottom: 4,
  },
  recommendationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  recommendationDetails: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 16,
    paddingLeft: 16,
  },
  fastingWindow: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  windowLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
  },
  recommendationNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  applyButton: {
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.3)',
    marginTop: 8,
  },
  applyButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  tipsContainer: {
    marginBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  generalTipsContainer: {
    marginBottom: 30,
  },
  generalTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipIconContainer: {
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 12,
    lineHeight: 20,
  },
});