import 'package:flutter/material.dart';
import '../models/cycle_phase.dart';

class CycleProvider extends ChangeNotifier {
  CyclePhase _selectedPhase = CyclePhase.follicular;

  CyclePhase get selectedPhase => _selectedPhase;

  CyclePhaseData get currentPhaseData => CyclePhases.data[_selectedPhase]!;

  void setSelectedPhase(CyclePhase phase) {
    _selectedPhase = phase;
    notifyListeners();
  }
}