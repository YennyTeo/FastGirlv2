import 'package:flutter/material.dart';
import '../models/fasting_phase.dart';

class FastingPhaseProvider extends ChangeNotifier {
  FastingPhase getFastingPhase(double hours) {
    final sortedPhases = List<FastingPhase>.from(FastingPhases.phases)
      ..sort((a, b) => b.hour.compareTo(a.hour));
    
    return sortedPhases.firstWhere(
      (phase) => hours >= phase.hour,
      orElse: () => FastingPhases.phases.first,
    );
  }

  List<FastingPhase> getAllPhases() {
    return FastingPhases.phases;
  }

  double getPhaseProgress(double hours) {
    final currentPhase = getFastingPhase(hours);
    final nextPhaseIndex = FastingPhases.phases.indexWhere((p) => p.hour > hours);
    
    if (nextPhaseIndex == -1) {
      return 100.0;
    }
    
    final nextPhase = FastingPhases.phases[nextPhaseIndex];
    final progress = ((hours - currentPhase.hour) / (nextPhase.hour - currentPhase.hour)) * 100;
    return progress.clamp(0.0, 100.0);
  }
}