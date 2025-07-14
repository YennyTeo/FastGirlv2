import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Plus, Trash2, Clock, CircleCheck as CheckCircle, Circle as XCircle, Flame, Target, TrendingUp, Award } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFastingRecord, FastingRecord } from '@/contexts/FastingRecordContext';
import { useCycle } from '@/contexts/CycleContext';

// Standard Android phone dimensions
const PHONE_WIDTH = 360;

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FastingRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'calendar'>('stats');
  
  const { records, addRecord, updateRecord, getRecord, getMonthRecords, deleteRecord } = useFastingRecord();
  const { isUsingCustomTimer } = useCycle();

  const [formData, setFormData] = useState({
    hours: '',
    startTime: '',
    endTime: '',
    notes: '',
    completed: true,
  });

  const stats = {
    currentStreak: 7,
    longestStreak: 21,
    totalFasts: 45,
    averageWindow: 16.2,
    weightLoss: 2.5,
    completionRate: 85,
  };

  const weeklyData = [
    { day: 'Mon', completed: true, duration: 16.5 },
    { day: 'Tue', completed: true, duration: 16.0 },
    { day: 'Wed', completed: false, duration: 12.5 },
    { day: 'Thu', completed: true, duration: 16.8 },
    { day: 'Fri', completed: true, duration: 16.2 },
    { day: 'Sat', completed: true, duration: 17.0 },
    { day: 'Sun', completed: true, duration: 16.5 },
  ];

  function getWeeklyData() {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = getRecord(dateStr);
      
      weekData.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        completed: record?.completed || false,
        duration: record?.hours || 0,
      });
    }
    
    return weekData;
  }

  const actualWeeklyData = getWeeklyData();

  const achievements = [
    { title: 'First Fast', description: 'Completed your first 16:8 fast', earned: true },
    { title: 'Week Warrior', description: 'Completed 7 consecutive fasts', earned: true },
    { title: 'Cycle Syncer', description: 'Adjusted fasting with cycle phases', earned: true },
    { title: 'Month Master', description: 'Completed 30 fasts', earned: false },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const openModal = (date: string) => {
    setSelectedDate(date);
    const existingRecord = getRecord(date);
    
    if (existingRecord) {
      setEditingRecord(existingRecord);
      setFormData({
        hours: existingRecord.hours.toString(),
        startTime: existingRecord.startTime || '',
        endTime: existingRecord.endTime || '',
        notes: existingRecord.notes || '',
        completed: existingRecord.completed,
      });
    } else {
      setEditingRecord(null);
      setFormData({
        hours: '',
        startTime: '',
        endTime: '',
        notes: '',
        completed: true,
      });
    }
    
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDate(null);
    setEditingRecord(null);
    setFormData({
      hours: '',
      startTime: '',
      endTime: '',
      notes: '',
      completed: true,
    });
  };

  const saveRecord = () => {
    if (!selectedDate || !formData.hours) {
      Alert.alert('Error', 'Please fill in the required fields');
      return;
    }

    const hours = parseFloat(formData.hours);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      Alert.alert('Error', 'Please enter a valid number of hours (0-24)');
      return;
    }

    const record: FastingRecord = {
      date: selectedDate,
      hours,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      notes: formData.notes || undefined,
      completed: formData.completed,
    };

    if (editingRecord) {
      updateRecord(selectedDate, record);
    } else {
      addRecord(record);
    }

    closeModal();
  };

  const deleteCurrentRecord = () => {
    if (selectedDate && editingRecord) {
      Alert.alert(
        'Delete Record',
        'Are you sure you want to delete this fasting record?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              deleteRecord(selectedDate);
              closeModal();
            }
          },
        ]
      );
    }
  };

  const getRecordForDay = (day: number) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getRecord(dateStr);
  };

  const getHoursColor = (hours: number) => {
    if (hours >= 16) return '#10B981'; // Green
    if (hours >= 12) return '#F59E0B'; // Yellow
    if (hours >= 8) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const monthRecords = getMonthRecords(currentDate.getFullYear(), currentDate.getMonth() + 1);
  const monthStats = {
    totalDays: monthRecords.length,
    completedDays: monthRecords.filter(r => r.completed).length,
    averageHours: monthRecords.length > 0 ? Math.round((monthRecords.reduce((sum, r) => sum + r.hours, 0) / monthRecords.length) * 10) / 10 : 0,
    longestFast: monthRecords.length > 0 ? Math.max(...monthRecords.map(r => r.hours)) : 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.brandTitle}>FAST 168</Text>
            <Text style={styles.title}>Progress & Calendar</Text>
            <Text style={styles.subtitle}>Track your fasting journey</Text>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
              onPress={() => setActiveTab('stats')}>
              <TrendingUp size={20} color={activeTab === 'stats' ? '#FFFFFF' : '#B3B3B3'} />
              <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
                Statistics
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
              onPress={() => setActiveTab('calendar')}>
              <Clock size={20} color={activeTab === 'calendar' ? '#FFFFFF' : '#B3B3B3'} />
              <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
                Calendar
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'stats' ? (
            // Statistics View
            <>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Flame size={24} color="#E91E63" />
                  </View>
                  <Text style={styles.statNumber}>{stats.currentStreak}</Text>
                  <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                
                <View style={styles.statCard}>
                  <View style={styles.statIcon}>
                    <Target size={24} color="#E91E63" />
                  </View>
                  <Text style={styles.statNumber}>{stats.completionRate}%</Text>
                  <Text style={styles.statLabel}>Success Rate</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Fasts Completed</Text>
                  <Text style={styles.detailValue}>{stats.totalFasts}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Longest Streak</Text>
                  <Text style={styles.detailValue}>{stats.longestStreak} days</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Average Fasting Window</Text>
                  <Text style={styles.detailValue}>{stats.averageWindow}h</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight Progress</Text>
                  <Text style={styles.detailValue}>-{stats.weightLoss} lbs</Text>
                </View>
              </View>

              <View style={styles.periodSelector}>
                <Text style={styles.sectionTitle}>Weekly Overview</Text>
                <View style={styles.periodButtons}>
                  {(['week', 'month', 'year'] as const).map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.periodButtonActive
                      ]}
                      onPress={() => setSelectedPeriod(period)}>
                      <Text style={[
                        styles.periodButtonText,
                        selectedPeriod === period && styles.periodButtonTextActive
                      ]}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.chartContainer}>
                <View style={styles.weeklyChart}>
                  {weeklyData.map((day, index) => (
                    <View key={index} style={styles.dayColumn}>
                      <View style={[
                        styles.dayBar,
                        { height: (day.duration / 18) * 100 },
                        { backgroundColor: day.completed ? '#E91E63' : '#374151' }
                      ]} />
                      <Text style={styles.dayLabel}>{day.day}</Text>
                      <Text style={styles.hourLabel}>{day.duration}h</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.achievementsContainer}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((achievement, index) => (
                  <View key={index} style={[
                    styles.achievementCard,
                    achievement.earned && styles.achievementCardEarned
                  ]}>
                    <View style={styles.achievementIcon}>
                      <Award size={24} color={achievement.earned ? '#E91E63' : '#6B7280'} />
                    </View>
                    <View style={styles.achievementContent}>
                      <Text style={[
                        styles.achievementTitle,
                        achievement.earned && styles.achievementTitleEarned
                      ]}>
                        {achievement.title}
                      </Text>
                      <Text style={styles.achievementDescription}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            // Calendar View
            <>
              {/* Month Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{monthStats.totalDays}</Text>
                  <Text style={styles.statLabel}>Days Tracked</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{monthStats.completedDays}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{monthStats.averageHours.toFixed(1)}h</Text>
                  <Text style={styles.statLabel}>Average</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{monthStats.longestFast}h</Text>
                  <Text style={styles.statLabel}>Longest</Text>
                </View>
              </View>

              {/* Calendar Header */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={() => navigateMonth('prev')}>
                  <ChevronLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text style={styles.monthTitle}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
                
                <TouchableOpacity 
                  style={styles.navButton}
                  onPress={() => navigateMonth('next')}>
                  <ChevronRight size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Week Days Header */}
              <View style={styles.weekDaysContainer}>
                {weekDays.map((day) => (
                  <View key={day} style={styles.weekDayCell}>
                    <Text style={styles.weekDayText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (day === null) {
                    return <View key={index} style={styles.emptyCell} />;
                  }

                  const record = getRecordForDay(day);
                  const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCell,
                        isToday && styles.todayCell,
                        record && styles.recordCell,
                      ]}
                      onPress={() => openModal(dateStr)}>
                      <Text style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        record && styles.recordDayText,
                      ]}>
                        {day}
                      </Text>
                      
                      {record && (
                        <View style={styles.recordIndicator}>
                          <View style={[
                            styles.hoursIndicator,
                            { backgroundColor: getHoursColor(record.hours) }
                          ]}>
                            <Text style={styles.hoursText}>{record.hours}h</Text>
                          </View>
                          <View style={styles.statusIndicator}>
                            {record.completed ? (
                              <CheckCircle size={12} color="#10B981" />
                            ) : (
                              <XCircle size={12} color="#EF4444" />
                            )}
                          </View>
                        </View>
                      )}
                      
                      {!record && (
                        <View style={styles.addIndicator}>
                          <Plus size={16} color="#6B7280" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Legend */}
              <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Hours Legend</Text>
                <View style={styles.legendItems}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendText}>16+ hours</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.legendText}>12-15 hours</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>8-11 hours</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#6B7280' }]} />
                    <Text style={styles.legendText}>Under 8 hours</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Add/Edit Record Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingRecord ? 'Edit' : 'Add'} Fasting Record
                </Text>
                <Text style={styles.modalDate}>{selectedDate}</Text>
              </View>

              <ScrollView style={styles.modalForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Fasting Hours *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.hours}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, hours: text }))}
                    placeholder="16"
                    placeholderTextColor="#6B7280"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>Start Time</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.startTime}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                      placeholder="20:00"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>End Time</Text>
                    <TextInput
                      style={styles.formInput}
                      value={formData.endTime}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                      placeholder="12:00"
                      placeholderTextColor="#6B7280"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Notes</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    value={formData.notes}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                    placeholder="How did you feel? Any observations..."
                    placeholderTextColor="#6B7280"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity
                  style={styles.completedToggle}
                  onPress={() => setFormData(prev => ({ ...prev, completed: !prev.completed }))}>
                  <View style={styles.toggleRow}>
                    <Text style={styles.toggleLabel}>Fast Completed</Text>
                    <View style={[
                      styles.toggleSwitch,
                      formData.completed && styles.toggleSwitchActive
                    ]}>
                      <View style={[
                        styles.toggleThumb,
                        formData.completed && styles.toggleThumbActive
                      ]} />
                    </View>
                  </View>
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalActions}>
                {editingRecord && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={deleteCurrentRecord}>
                    <Trash2 size={20} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveRecord}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#E91E63',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#E91E63',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
  periodSelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodButtonActive: {
    backgroundColor: '#E91E63',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 40,
  },
  dayBar: {
    width: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  hourLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  achievementCardEarned: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(233, 30, 99, 0.2)',
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  achievementTitleEarned: {
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B3B3B3',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  monthTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#B3B3B3',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  emptyCell: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  todayCell: {
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  recordCell: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  todayText: {
    color: '#E91E63',
    fontFamily: 'Inter-Bold',
  },
  recordDayText: {
    fontSize: 12,
  },
  recordIndicator: {
    alignItems: 'center',
    gap: 2,
  },
  hoursIndicator: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  addIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  legendContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
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
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A2E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#B3B3B3',
  },
  modalForm: {
    paddingHorizontal: 20,
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  completedToggle: {
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#E91E63',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#E91E63',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});