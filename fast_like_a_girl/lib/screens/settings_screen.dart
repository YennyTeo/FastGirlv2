import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool notifications = true;
  bool darkMode = true;
  bool reminderEnabled = true;
  bool cycleTracking = true;

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
                  'Settings',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Customize your fasting experience',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFFB3B3B3),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Profile Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: const BoxDecoration(
                      color: Color(0xFFE91E63),
                      shape: BoxShape.circle,
                    ),
                    child: const Center(
                      child: Text(
                        'A',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Anna',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'anna@example.com',
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFFB3B3B3),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE91E63).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFE91E63)),
                    ),
                    child: const Text(
                      'Edit',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFE91E63),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Fasting Settings
            _buildSettingsGroup(
              'Fasting Settings',
              [
                _buildSettingItem(
                  Icons.access_time,
                  'Fasting Schedule',
                  '16:8 Intermittent Fasting',
                  null,
                ),
                _buildSettingItem(
                  Icons.notifications,
                  'Reminders',
                  'Get notified when to start/stop fasting',
                  Switch(
                    value: reminderEnabled,
                    onChanged: (value) => setState(() => reminderEnabled = value),
                    activeColor: const Color(0xFFE91E63),
                  ),
                ),
                _buildSettingItem(
                  Icons.nightlight_round,
                  'Cycle Tracking',
                  'Sync fasting with menstrual cycle',
                  Switch(
                    value: cycleTracking,
                    onChanged: (value) => setState(() => cycleTracking = value),
                    activeColor: const Color(0xFFE91E63),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // App Settings
            _buildSettingsGroup(
              'App Settings',
              [
                _buildSettingItem(
                  Icons.notifications,
                  'Notifications',
                  'Push notifications',
                  Switch(
                    value: notifications,
                    onChanged: (value) => setState(() => notifications = value),
                    activeColor: const Color(0xFFE91E63),
                  ),
                ),
                _buildSettingItem(
                  Icons.dark_mode,
                  'Dark Mode',
                  'Enable dark theme',
                  Switch(
                    value: darkMode,
                    onChanged: (value) => setState(() => darkMode = value),
                    activeColor: const Color(0xFFE91E63),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Account & Privacy
            _buildSettingsGroup(
              'Account & Privacy',
              [
                _buildSettingItem(
                  Icons.person,
                  'Profile',
                  'Manage your account',
                  const Icon(Icons.chevron_right, color: Color(0xFF6B7280)),
                ),
                _buildSettingItem(
                  Icons.security,
                  'Privacy',
                  'Data and privacy settings',
                  const Icon(Icons.chevron_right, color: Color(0xFF6B7280)),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Support
            _buildSettingsGroup(
              'Support',
              [
                _buildSettingItem(
                  Icons.help_outline,
                  'Help & FAQ',
                  'Get help with the app',
                  const Icon(Icons.chevron_right, color: Color(0xFF6B7280)),
                ),
                _buildSettingItem(
                  Icons.info_outline,
                  'About',
                  'App version and info',
                  const Icon(Icons.chevron_right, color: Color(0xFF6B7280)),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Data
            _buildSettingsGroup(
              'Data',
              [
                _buildSettingItem(
                  Icons.download,
                  'Export Data',
                  'Download your fasting data',
                  const Icon(Icons.chevron_right, color: Color(0xFF6B7280)),
                ),
                _buildSettingItem(
                  Icons.delete_forever,
                  'Reset All Data',
                  'This cannot be undone',
                  const Icon(Icons.chevron_right, color: Color(0xFFEF4444)),
                  textColor: const Color(0xFFEF4444),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Footer
            Container(
              padding: const EdgeInsets.only(top: 20),
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(color: Colors.white12),
                ),
              ),
              child: const Column(
                children: [
                  Text(
                    'Fast Like a Girl v1.0.0',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Empowering women through cycle-synced fasting',
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFFB3B3B3),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsGroup(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(children: items),
        ),
      ],
    );
  }

  Widget _buildSettingItem(
    IconData icon,
    String title,
    String description,
    Widget? action, {
    Color? textColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.white12),
        ),
      ),
      child: Row(
        children: [
          Icon(icon, size: 24, color: const Color(0xFFE91E63)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: textColor ?? Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Color(0xFFB3B3B3),
                  ),
                ),
              ],
            ),
          ),
          if (action != null) ...[
            const SizedBox(width: 16),
            action,
          ],
        ],
      ),
    );
  }
}