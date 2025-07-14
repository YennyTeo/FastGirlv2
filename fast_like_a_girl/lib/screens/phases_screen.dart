import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/fasting_phase_provider.dart';
import '../models/fasting_phase.dart';

class PhasesScreen extends StatelessWidget {
  const PhasesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<FastingPhaseProvider>(
      builder: (context, fastingPhaseProvider, child) {
        final phases = fastingPhaseProvider.getAllPhases();
        
        return SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                // Header
                const Column(
                  children: [
                    Text(
                      'FAST 168',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFE91E63),
                        letterSpacing: 2,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Fasting Phases',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Understand what happens during each hour',
                      style: TextStyle(
                        fontSize: 16,
                        color: Color(0xFFB3B3B3),
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // Timeline
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: phases.length,
                  itemBuilder: (context, index) {
                    final phase = phases[index];
                    final isLast = index == phases.length - 1;
                    
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Timeline Left
                        SizedBox(
                          width: 50,
                          child: Column(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: Color(phase.color),
                                  shape: BoxShape.circle,
                                ),
                                child: Center(
                                  child: Text(
                                    '${phase.hour}h',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                              if (!isLast)
                                Container(
                                  width: 2,
                                  height: 60,
                                  color: Colors.white.withOpacity(0.1),
                                  margin: const EdgeInsets.symmetric(vertical: 8),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        
                        // Phase Content
                        Expanded(
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 20),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: Colors.white.withOpacity(0.1),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      phase.icon,
                                      style: const TextStyle(fontSize: 24),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            phase.title,
                                            style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.white,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: _getIntensityColor(phase.intensity),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                _getIntensityIcon(phase.intensity),
                                                const SizedBox(width: 4),
                                                Text(
                                                  phase.intensity.name.toUpperCase(),
                                                  style: const TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.white,
                                                    letterSpacing: 0.5,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  phase.description,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: Colors.white,
                                    height: 1.4,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                const Text(
                                  'Key Benefits:',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                ...phase.benefits.map((benefit) => Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 6,
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color: Color(phase.color),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Expanded(
                                        child: Text(
                                          benefit,
                                          style: const TextStyle(
                                            fontSize: 13,
                                            color: Color(0xFFB3B3B3),
                                            height: 1.3,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                )),
                              ],
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 30),

                // Legend
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'Intensity Levels',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildLegendItem(FastingIntensity.low, 'Gentle Start'),
                          _buildLegendItem(FastingIntensity.medium, 'Building Up'),
                          _buildLegendItem(FastingIntensity.high, 'Peak Benefits'),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildLegendItem(FastingIntensity intensity, String label) {
    return Column(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: _getIntensityColor(intensity),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: _getIntensityIcon(intensity),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.white,
            fontWeight: FontWeight.w500,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Color _getIntensityColor(FastingIntensity intensity) {
    switch (intensity) {
      case FastingIntensity.low:
        return const Color(0xFF6B7280);
      case FastingIntensity.medium:
        return const Color(0xFFF59E0B);
      case FastingIntensity.high:
        return const Color(0xFFE91E63);
    }
  }

  Widget _getIntensityIcon(FastingIntensity intensity) {
    IconData icon;
    switch (intensity) {
      case FastingIntensity.low:
        icon = Icons.access_time;
        break;
      case FastingIntensity.medium:
        icon = Icons.trending_up;
        break;
      case FastingIntensity.high:
        icon = Icons.flash_on;
        break;
    }
    return Icon(icon, size: 16, color: Colors.white);
  }
}