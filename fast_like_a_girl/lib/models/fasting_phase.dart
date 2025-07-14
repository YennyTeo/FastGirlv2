enum FastingIntensity { low, medium, high }

class FastingPhase {
  final int hour;
  final String title;
  final String description;
  final List<String> benefits;
  final int color;
  final String icon;
  final FastingIntensity intensity;

  const FastingPhase({
    required this.hour,
    required this.title,
    required this.description,
    required this.benefits,
    required this.color,
    required this.icon,
    required this.intensity,
  });
}

class FastingPhases {
  static const List<FastingPhase> phases = [
    FastingPhase(
      hour: 0,
      title: 'Fed State',
      description: 'Your body is processing the last meal',
      benefits: ['Digestion active', 'Insulin elevated', 'Glucose being used'],
      color: 0xFF6B7280,
      icon: '🍽️',
      intensity: FastingIntensity.low,
    ),
    FastingPhase(
      hour: 1,
      title: 'Early Digestion',
      description: 'Food is being broken down and absorbed',
      benefits: ['Nutrients entering bloodstream', 'Energy readily available', 'Metabolism active'],
      color: 0xFF6B7280,
      icon: '⚡',
      intensity: FastingIntensity.low,
    ),
    FastingPhase(
      hour: 2,
      title: 'Post-Absorptive',
      description: 'Transitioning from fed to fasted state',
      benefits: ['Insulin starting to drop', 'Glycogen stores being used', 'Fat oxidation beginning'],
      color: 0xFF8B5CF6,
      icon: '🔄',
      intensity: FastingIntensity.low,
    ),
    FastingPhase(
      hour: 3,
      title: 'Early Fasting',
      description: 'Body switches to stored energy',
      benefits: ['Glycogen breakdown active', 'Insulin levels dropping', 'Fat burning increases'],
      color: 0xFF8B5CF6,
      icon: '🔥',
      intensity: FastingIntensity.medium,
    ),
    FastingPhase(
      hour: 4,
      title: 'Glycogen Depletion',
      description: 'Liver glycogen stores being utilized',
      benefits: ['Enhanced fat oxidation', 'Ketone production starts', 'Mental clarity improves'],
      color: 0xFF10B981,
      icon: '🧠',
      intensity: FastingIntensity.medium,
    ),
    FastingPhase(
      hour: 6,
      title: 'Fat Burning Mode',
      description: 'Primary fuel source shifts to fat',
      benefits: ['Significant fat oxidation', 'Ketones increasing', 'Appetite suppression'],
      color: 0xFF10B981,
      icon: '💪',
      intensity: FastingIntensity.medium,
    ),
    FastingPhase(
      hour: 8,
      title: 'Metabolic Switch',
      description: 'Deep metabolic adaptation occurring',
      benefits: ['Optimal fat burning', 'Ketosis deepening', 'Growth hormone rising'],
      color: 0xFFF59E0B,
      icon: '⚡',
      intensity: FastingIntensity.high,
    ),
    FastingPhase(
      hour: 10,
      title: 'Enhanced Ketosis',
      description: 'Body fully adapted to fasting state',
      benefits: ['Peak ketone production', 'Maximum mental clarity', 'Cellular repair active'],
      color: 0xFFF59E0B,
      icon: '🌟',
      intensity: FastingIntensity.high,
    ),
    FastingPhase(
      hour: 12,
      title: 'Autophagy Activation',
      description: 'Cellular cleanup and renewal begins',
      benefits: ['Autophagy initiated', 'Cellular detox', 'Anti-aging benefits'],
      color: 0xFFE91E63,
      icon: '🔬',
      intensity: FastingIntensity.high,
    ),
    FastingPhase(
      hour: 14,
      title: 'Deep Autophagy',
      description: 'Intensive cellular repair and renewal',
      benefits: ['Enhanced autophagy', 'Protein recycling', 'Immune system boost'],
      color: 0xFFE91E63,
      icon: '🛡️',
      intensity: FastingIntensity.high,
    ),
    FastingPhase(
      hour: 16,
      title: 'Optimal Fasting',
      description: 'Peak fasting benefits achieved',
      benefits: ['Maximum autophagy', 'Stem cell activation', 'Longevity pathways active'],
      color: 0xFFDC2626,
      icon: '💎',
      intensity: FastingIntensity.high,
    ),
    FastingPhase(
      hour: 18,
      title: 'Extended Benefits',
      description: 'Advanced fasting state with enhanced benefits',
      benefits: ['Deep cellular renewal', 'Enhanced neuroplasticity', 'Maximum fat adaptation'],
      color: 0xFFDC2626,
      icon: '🚀',
      intensity: FastingIntensity.high,
    ),
  ];
}