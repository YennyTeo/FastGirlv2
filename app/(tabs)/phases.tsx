import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, TrendingUp, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFastingPhase } from '@/contexts/FastingPhaseContext';

// Standard Android phone dimensions
const PHONE_WIDTH = 360;

export default function PhasesScreen() {
  const { getAllPhases } = useFastingPhase();
  const phases = getAllPhases();

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return '#6B7280';
      case 'medium': return '#F59E0B';
      case 'high': return '#E91E63';
      default: return '#6B7280';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'low': return Clock;
      case 'medium': return TrendingUp;
      case 'high': return Zap;
      default: return Clock;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>FAST 168</Text>
            <Text style={styles.title}>Fasting Phases</Text>
            <Text style={styles.subtitle}>Understand what happens during each hour</Text>
          </View>

          <View style={styles.timelineContainer}>
            {phases.map((phase, index) => {
              const IntensityIcon = getIntensityIcon(phase.intensity);
              const isLast = index === phases.length - 1;
              
              return (
                <View key={phase.hour} style={styles.phaseItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.hourBadge, { backgroundColor: phase.color }]}>
                      <Text style={styles.hourText}>{phase.hour}h</Text>
                    </View>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  
                  <View style={styles.phaseContent}>
                    <View style={styles.phaseCard}>
                      <View style={styles.phaseCardHeader}>
                        <View style={styles.phaseInfo}>
                          <Text style={styles.phaseEmoji}>{phase.icon}</Text>
                          <View style={styles.phaseTitleContainer}>
                            <Text style={styles.phaseTitle}>{phase.title}</Text>
                            <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(phase.intensity) }]}>
                              <IntensityIcon size={12} color="#FFFFFF" />
                              <Text style={styles.intensityText}>{phase.intensity.toUpperCase()}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      
                      <Text style={styles.phaseDescription}>{phase.description}</Text>
                      
                      <View style={styles.benefitsContainer}>
                        <Text style={styles.benefitsTitle}>Key Benefits:</Text>
                        {phase.benefits.map((benefit, benefitIndex) => (
                          <View key={`${phase.hour}-${benefitIndex}`} style={styles.benefitItem}>
                            <View style={[styles.benefitDot, { backgroundColor: phase.color }]} />
                            <Text style={styles.benefitText}>{benefit}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Intensity Levels</Text>
            <View style={styles.legendItems}>
              {[
                { level: 'low', label: 'Gentle Start', icon: Clock },
                { level: 'medium', label: 'Building Up', icon: TrendingUp },
                { level: 'high', label: 'Peak Benefits', icon: Zap },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <View key={item.level} style={styles.legendItem}>
                    <View style={[styles.legendBadge, { backgroundColor: getIntensityColor(item.level) }]}>
                      <IconComponent size={16} color="#FFFFFF" />
                    </View>
                    <Text style={styles.legendLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>
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
  timelineContainer: {
    marginBottom: 30,
  },
  phaseItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 50,
  },
  hourBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  hourText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 60,
  },
  phaseContent: {
    flex: 1,
  },
  phaseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  phaseCardHeader: {
    marginBottom: 12,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  phaseTitleContainer: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  intensityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  phaseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    flex: 1,
    lineHeight: 18,
  },
  legendContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});