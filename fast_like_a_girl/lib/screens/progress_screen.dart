import 'package:flutter/material.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({super.key});

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  String selectedPeriod = 'week';
  
  final stats = {
    'currentStreak': 7,
    'longestStreak': 21,
    'totalFasts': 45,
    'averageWindow': 16.2,
    'weightLoss': 2.5,
    'completionRate': 85,
  };

  final weeklyData = [
    {'day': 'Mon', 'completed': true, 'duration': 16.5},
    {'day': 'Tue', 'completed': true, 'duration': 16.0},
    {'day': 'Wed', 'completed': false, 'duration': 12.5},
    {'day': 'Thu', 'completed': true, 'duration': 16.8},
    {'day': 'Fri', 'completed': true, 'duration': 16.2},
    {'day': 'Sat', 'completed': true, 'duration': 17.0},
    {'day': 'Sun', 'completed': true, 'duration': 16.5},
  ];

  final achievements = [
    {'title': 'First Fast', 'description': 'Completed your first 16:8 fast', 'earned': true},
    {'title': 'Week Warrior', 'description': 'Completed 7 consecutive fasts', 'earned': true},
    {'title': 'Cycle Syncer', 'description': 'Adjusted fasting with cycle phases', 'earned': true},
    {'title': 'Month Master', 'description': 'Completed 30 fasts', 'earned': false},
  ];

  @override
  Widget build(BuildContext context) {
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
                  'Your Progress',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Track your fasting journey',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFFB3B3B3),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Stats Cards
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    Icons.local_fire_department,
                    '${stats['currentStreak']}',
                    'Current Streak',
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard(
                    Icons.track_changes,
                    '${stats['completionRate']}%',
                    'Success Rate',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Details
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  _buildDetailRow('Total Fasts Completed', '${stats['totalFasts']}'),
                  _buildDetailRow('Longest Streak', '${stats['longestStreak']} days'),
                  _buildDetailRow('Average Fasting Window', '${stats['averageWindow']}h'),
                  _buildDetailRow('Weight Progress', '-${stats['weightLoss']} lbs'),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Period Selector
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Weekly Overview',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: ['week', 'month', 'year'].map((period) {
                    final isSelected = selectedPeriod == period;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => setState(() => selectedPeriod = period),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected 
                                ? const Color(0xFFE91E63) 
                                : Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            period[0].toUpperCase() + period.substring(1),
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: isSelected ? Colors.white : const Color(0xFFB3B3B3),
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Chart
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  SizedBox(
                    height: 120,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: weeklyData.map((day) {
                        final height = (day['duration'] as double) / 18 * 100;
                        final completed = day['completed'] as bool;
                        
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Container(
                              width: 16,
                              height: height,
                              decoration: BoxDecoration(
                                color: completed 
                                    ? const Color(0xFFE91E63) 
                                    : const Color(0xFF374151),
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              day['day'] as String,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${day['duration']}h',
                              style: const TextStyle(
                                fontSize: 10,
                                color: Color(0xFFB3B3B3),
                              ),
                            ),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Achievements
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Achievements',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                ...achievements.map((achievement) {
                  final earned = achievement['earned'] as bool;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: earned 
                          ? const Color(0xFFE91E63).withOpacity(0.1)
                          : Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: earned 
                          ? Border.all(color: const Color(0xFFE91E63).withOpacity(0.2))
                          : null,
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.emoji_events,
                          size: 24,
                          color: earned ? const Color(0xFFE91E63) : const Color(0xFF6B7280),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                achievement['title'] as String,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: earned ? Colors.white : const Color(0xFF6B7280),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                achievement['description'] as String,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: Color(0xFFB3B3B3),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(IconData icon, String number, String label) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, size: 24, color: const Color(0xFFE91E63)),
          const SizedBox(height: 12),
          Text(
            number,
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFFB3B3B3),
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              color: Color(0xFFE91E63),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}