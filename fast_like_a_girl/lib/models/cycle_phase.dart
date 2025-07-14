enum CyclePhase { menstrual, follicular, ovulation, luteal }

class CyclePhaseData {
  final String name;
  final String days;
  final int recommendedHours;
  final String fastingWindow;
  final int color;
  final String description;
  final List<String> fastingTips;
  final List<String> benefits;

  const CyclePhaseData({
    required this.name,
    required this.days,
    required this.recommendedHours,
    required this.fastingWindow,
    required this.color,
    required this.description,
    required this.fastingTips,
    required this.benefits,
  });
}

class CyclePhases {
  static const Map<CyclePhase, CyclePhaseData> data = {
    CyclePhase.menstrual: CyclePhaseData(
      name: 'Menstrual Phase',
      days: '1-7',
      recommendedHours: 12,
      fastingWindow: '12:12',
      color: 0xFFDC2626,
      description: 'Rest and gentle fasting',
      fastingTips: [
        'Shorter fasting windows (12-14 hours)',
        'Focus on nutrient-dense foods',
        'Stay hydrated and get extra rest',
        'Gentle movement and self-care'
      ],
      benefits: ['Gentle detox', 'Reduced inflammation', 'Better sleep'],
    ),
    CyclePhase.follicular: CyclePhaseData(
      name: 'Follicular Phase',
      days: '1-13',
      recommendedHours: 16,
      fastingWindow: '16:8',
      color: 0xFF10B981,
      description: 'Building energy phase',
      fastingTips: [
        'Standard 16:8 fasting works well',
        'Increase protein and healthy fats',
        'Great time for new challenges',
        'Higher intensity workouts'
      ],
      benefits: ['Increased energy', 'Better focus', 'Muscle building'],
    ),
    CyclePhase.ovulation: CyclePhaseData(
      name: 'Ovulation Phase',
      days: '14',
      recommendedHours: 18,
      fastingWindow: '18:6',
      color: 0xFFF59E0B,
      description: 'Peak energy and metabolism',
      fastingTips: [
        'Longer fasting windows (16-18 hours)',
        'Optimal fat burning window',
        'High-intensity workouts',
        'Social activities and challenges'
      ],
      benefits: ['Peak metabolism', 'Maximum fat burn', 'High energy'],
    ),
    CyclePhase.luteal: CyclePhaseData(
      name: 'Luteal Phase',
      days: '15-28',
      recommendedHours: 14,
      fastingWindow: '14:10',
      color: 0xFF8B5CF6,
      description: 'Prepare for next cycle',
      fastingTips: [
        'Flexible fasting windows (14-16 hours)',
        'Increase complex carbs',
        'Stress management priority',
        'Gentle yoga and walks'
      ],
      benefits: ['Hormone balance', 'Reduced cravings', 'Better mood'],
    ),
  };
}