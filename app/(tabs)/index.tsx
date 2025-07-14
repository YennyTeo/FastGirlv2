import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw, Droplets, Heart, Brain } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCycle } from '@/contexts/CycleContext';
import { useFastingPhase } from '@/contexts/FastingPhaseContext';
import { useFastingRecord } from '@/contexts/FastingRecordContext';

// Standard Android phone dimensions (360dp width is common baseline)
const PHONE_WIDTH = 360;
const CIRCLE_SIZE = PHONE_WIDTH * 0.65; // Slightly smaller for better proportions

export default function HomeScreen() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'fasting' | 'eating'>('fasting');
  const [fastingStartTime, setFastingStartTime] = useState<Date | null>(null);
  
  const { getCurrentPhaseData, getEffectiveHours, isUsingCustomTimer } = useCycle();
  const phaseData = getCurrentPhaseData();
  const targetHours = getEffectiveHours();
  const { addRecord, getRecord } = useFastingRecord();
  
  const { getFastingPhase, getPhaseProgress } = useFastingPhase();
  const currentHours = seconds / 3600;
  const currentFastingPhase = getFastingPhase(currentHours);
  const phaseProgress = getPhaseProgress(currentHours);

  const targetSeconds = targetHours * 3600;
  const progress = Math.min(seconds / targetSeconds, 1);
  const remainingSeconds = Math.max(targetSeconds - seconds, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!isActive && !fastingStartTime) {
      setFastingStartTime(new Date());
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setFastingStartTime(null);
  };

  const getPhaseMessage = () => {
    if (seconds >= targetSeconds) {
      return `🎉 ${targetHours}h Fast Complete! You can start eating now.`;
    }
    
    return `${currentFastingPhase.icon} ${currentFastingPhase.title}: ${currentFastingPhase.description}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>FAST 168</Text>
            <Text style={styles.title}>Fast Like a Girl</Text>
            <Text style={styles.subtitle}>
              {isUsingCustomTimer 
                ? `${targetHours}:${24 - targetHours} Custom Fasting`
                : `${phaseData.fastingWindow} Intermittent Fasting`
              }
            </Text>
            <View style={styles.phaseIndicator}>
              <View style={[styles.phaseDot, { backgroundColor: phaseData.color }]} />
              <Text style={styles.phaseLabel}>
                {isUsingCustomTimer ? 'Custom Timer' : phaseData.name}
              </Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <View style={styles.circleContainer}>
              <View style={styles.circle}>
                <View style={[styles.progressCircle, { transform: [{ rotate: `${progress * 360}deg` }] }]} />
                <View style={styles.innerCircle}>
                  <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
                  <Text style={styles.timeLabel}>remaining</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            
            <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
          </View>

          <View style={styles.phaseContainer}>
            <Text style={styles.phaseText}>{getPhaseMessage()}</Text>
            
            <View style={styles.currentPhaseDetails}>
              <View style={styles.phaseHeader}>
                <Text style={styles.phaseTitle}>{currentFastingPhase.title}</Text>
                <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(currentFastingPhase.intensity) }]}>
                  <Text style={styles.intensityText}>{currentFastingPhase.intensity.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.benefitsList}>
                {currentFastingPhase.benefits.slice(0, 2).map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <View style={[styles.benefitDot, { backgroundColor: currentFastingPhase.color }]} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
              
              {currentHours < targetHours && (
                <View style={styles.nextPhaseContainer}>
                  <Text style={styles.nextPhaseLabel}>Next Phase Progress</Text>
                  <View style={styles.nextPhaseBar}>
                    <View style={[styles.nextPhaseFill, { width: `${phaseProgress}%` }]} />
                  </View>
                  <Text style={styles.nextPhaseText}>{Math.round(phaseProgress)}% to next phase</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Current Benefits</Text>
            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <Droplets size={24} color="#E91E63" />
                <Text style={styles.benefitText}>Autophagy</Text>
              </View>
              <View style={styles.benefitItem}>
                <Heart size={24} color="#E91E63" />
                <Text style={styles.benefitText}>Heart Health</Text>
              </View>
              <View style={styles.benefitItem}>
                <Brain size={24} color="#E91E63" />
                <Text style={styles.benefitText}>Mental Clarity</Text>
              </View>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.resetButton]}
              onPress={handleReset}>
              <RotateCcw size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.primaryButton]}
              onPress={handleStartStop}>
              {isActive ? (
                <Pause size={24} color="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" />
              )}
              <Text style={styles.buttonText}>
                {isActive ? 'Pause' : 'Start'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const getIntensityColor = (intensity: string) => {
  switch (intensity) {
    case 'low': return '#6B7280';
    case 'medium': return '#F59E0B';
    case 'high': return '#E91E63';
    default: return '#6B7280';
  }
};

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
    fontSize: 24,
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
    marginBottom: 12,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  phaseLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    maxWidth: 240,
    maxHeight: 240,
  },
  progressCircle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#E91E63',
    borderRightColor: '#E91E63',
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#1F2937',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  phaseContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  phaseText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  currentPhaseDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  intensityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  benefitsList: {
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    flex: 1,
  },
  nextPhaseContainer: {
    marginTop: 8,
  },
  nextPhaseLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
    marginBottom: 6,
  },
  nextPhaseBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  nextPhaseFill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 2,
  },
  nextPhaseText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  benefitItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    minWidth: 80,
  },
  benefitText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#E91E63',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});