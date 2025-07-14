import 'package:fast_like_a_girl/models/fasting_phase.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../providers/cycle_provider.dart';
import '../providers/fasting_phase_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isActive = false;
  int _seconds = 0;
  Timer? _timer;
  DateTime? _fastingStartTime;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _formatTime(int totalSeconds) {
    final hours = totalSeconds ~/ 3600;
    final minutes = (totalSeconds % 3600) ~/ 60;
    final secs = totalSeconds % 60;
    return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  void _handleStartStop() {
    if (!_isActive && _fastingStartTime == null) {
      _fastingStartTime = DateTime.now();
    }
    
    setState(() {
      _isActive = !_isActive;
    });

    if (_isActive) {
      _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
        setState(() {
          _seconds++;
        });
      });
    } else {
      _timer?.cancel();
    }
  }

  void _handleReset() {
    _timer?.cancel();
    setState(() {
      _isActive = false;
      _seconds = 0;
      _fastingStartTime = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<CycleProvider, FastingPhaseProvider>(
      builder: (context, cycleProvider, fastingPhaseProvider, child) {
        final phaseData = cycleProvider.currentPhaseData;
        final targetHours = phaseData.recommendedHours;
        final targetSeconds = targetHours * 3600;
        final progress = (_seconds / targetSeconds).clamp(0.0, 1.0);
        final remainingSeconds = (targetSeconds - _seconds).clamp(0, targetSeconds);
        final currentHours = _seconds / 3600;
        final currentFastingPhase = fastingPhaseProvider.getFastingPhase(currentHours);
        final phaseProgress = fastingPhaseProvider.getPhaseProgress(currentHours);

        return SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                // Header
                Column(
                  children: [
                    const Text(
                      'FAST 168',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFE91E63),
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Fast Like a Girl',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${phaseData.fastingWindow} Intermittent Fasting',
                      style: const TextStyle(
                        fontSize: 16,
                        color: Color(0xFFB3B3B3),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: BoxDecoration(
                              color: Color(phaseData.color),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            phaseData.name,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.white,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // Timer Circle
                Column(
                  children: [
                    SizedBox(
                      width: 240,
                      height: 240,
                      child: Stack(
                        children: [
                          Container(
                            width: 240,
                            height: 240,
                            decoration: const BoxDecoration(
                              color: Color(0xFF1F2937),
                              shape: BoxShape.circle,
                            ),
                          ),
                          SizedBox(
                            width: 240,
                            height: 240,
                            child: CircularProgressIndicator(
                              value: progress,
                              strokeWidth: 8,
                              backgroundColor: Colors.transparent,
                              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFE91E63)),
                            ),
                          ),
                          Positioned.fill(
                            child: Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    _formatTime(remainingSeconds),
                                    style: const TextStyle(
                                      fontSize: 36,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'remaining',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Color(0xFFB3B3B3),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      width: double.infinity,
                      height: 8,
                      decoration: BoxDecoration(
                        color: const Color(0xFF1F2937),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: progress,
                        child: Container(
                          decoration: BoxDecoration(
                            color: const Color(0xFFE91E63),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${(progress * 100).round()}% Complete',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // Current Phase Info
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE91E63).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFFE91E63).withOpacity(0.2),
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        _seconds >= targetSeconds
                            ? '🎉 ${targetHours}h Fast Complete! You can start eating now.'
                            : '${currentFastingPhase.icon} ${currentFastingPhase.title}: ${currentFastingPhase.description}',
                        style: const TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      if (currentHours < targetHours) ...[
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            border: Border(
                              top: BorderSide(
                                color: Colors.white.withOpacity(0.1),
                              ),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    currentFastingPhase.title,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.white,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: _getIntensityColor(currentFastingPhase.intensity),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      currentFastingPhase.intensity.name.toUpperCase(),
                                      style: const TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              ...currentFastingPhase.benefits.take(2).map((benefit) => Padding(
                                padding: const EdgeInsets.only(bottom: 6),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 6,
                                      height: 6,
                                      decoration: BoxDecoration(
                                        color: Color(currentFastingPhase.color),
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        benefit,
                                        style: const TextStyle(
                                          fontSize: 14,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              )),
                              const SizedBox(height: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Next Phase Progress',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFFB3B3B3),
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Container(
                                    height: 4,
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(2),
                                    ),
                                    child: FractionallySizedBox(
                                      alignment: Alignment.centerLeft,
                                      widthFactor: phaseProgress / 100,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFE91E63),
                                          borderRadius: BorderRadius.circular(2),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${phaseProgress.round()}% to next phase',
                                    style: const TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFFB3B3B3),
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 30),

                // Benefits
                Column(
                  children: [
                    const Text(
                      'Current Benefits',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildBenefitCard(Icons.water_drop, 'Autophagy'),
                        _buildBenefitCard(Icons.favorite, 'Heart Health'),
                        _buildBenefitCard(Icons.psychology, 'Mental Clarity'),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 30),

                // Controls
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _handleReset,
                        icon: const Icon(Icons.refresh, color: Colors.white),
                        label: const Text(
                          'Reset',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white.withOpacity(0.1),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: _handleStartStop,
                        icon: Icon(
                          _isActive ? Icons.pause : Icons.play_arrow,
                          color: Colors.white,
                        ),
                        label: Text(
                          _isActive ? 'Pause' : 'Start',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFE91E63),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBenefitCard(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, size: 24, color: const Color(0xFFE91E63)),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
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
}