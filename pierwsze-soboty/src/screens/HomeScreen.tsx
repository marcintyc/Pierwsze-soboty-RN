import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, Platform } from 'react-native';
import { Hero } from '../components/Hero';
import { Countdown } from '../components/Countdown';
import { formatDateHuman, getNextFirstSaturday, getUpcomingFirstSaturdays } from '../utils/dates';
import { HeartRow } from '../components/HeartRow';
import { loadProgress, saveProgress, ProgressState } from '../storage/progress';
import { requestNotificationPermissions, scheduleFirstSaturdayReminders } from '../notifications/scheduler';

export const HomeScreen: React.FC = () => {
  const [nextFirstSaturday, setNextFirstSaturday] = useState<Date>(getNextFirstSaturday(new Date()));
  const [progress, setProgress] = useState<ProgressState>({ completedHearts: 0 });
  const [isStartModalVisible, setStartModalVisible] = useState(false);
  const [startMode, setStartMode] = useState<'from-zero' | 'from-specific'>('from-zero');
  const [specificSaturday, setSpecificSaturday] = useState<string>('');
  const [intention, setIntention] = useState<string>('');

  const upcoming = useMemo(() => getUpcomingFirstSaturdays(6), []);

  useEffect(() => {
    loadProgress().then((p) => setProgress(p));
  }, []);

  useEffect(() => {
    // Ask for notifications and schedule weekly reminders
    (async () => {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleFirstSaturdayReminders();
      }
    })();
  }, []);

  const canStartNow = useMemo(() => {
    const now = new Date();
    const isSaturday = now.getDay() === 6; // 6 = Saturday
    const isTodayFirstSaturday = isSaturday && now.getDate() === getNextFirstSaturday(now).getDate();
    const beforeNextStart = now >= new Date(nextFirstSaturday.getFullYear(), nextFirstSaturday.getMonth(), nextFirstSaturday.getDate(), 0, 0, 0, 0);
    return isTodayFirstSaturday && beforeNextStart;
  }, [nextFirstSaturday]);

  const onConfirmStart = async () => {
    const payload: ProgressState = {
      completedHearts: progress.completedHearts ?? 0,
      currentIntention: intention || progress.currentIntention,
      startedAtIso: new Date().toISOString(),
    };

    if (startMode === 'from-specific' && specificSaturday) {
      payload.selectedStartSaturdayIso = new Date(specificSaturday).toISOString();
    }

    await saveProgress(payload);
    setProgress(payload);
    setStartModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
      <Hero />

      <View style={{ backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Najbliższa pierwsza sobota</Text>
        <Text style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>{formatDateHuman(nextFirstSaturday)}</Text>
        <Countdown target={new Date(nextFirstSaturday)} />
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <Pressable style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Warunki</Text>
          <Text style={{ color: '#444' }}>- Różaniec
- 15 minut rozważania tajemnic
- Spowiedź święta
- Komunia święta
- Intencja wynagradzająca</Text>
        </Pressable>
        <Pressable
          onPress={() => setStartModalVisible(true)}
          style={{ flex: 1, backgroundColor: canStartNow ? '#1e40af' : '#9ca3af', borderRadius: 12, padding: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: 'white', marginBottom: 6 }}>Rozpocznij nabożeństwo</Text>
          <Text style={{ color: 'white' }}>{canStartNow ? 'Dostępne teraz' : 'Dostępne w pierwszą sobotę'}</Text>
        </Pressable>
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Postęp</Text>
        <HeartRow countFilled={progress.completedHearts ?? 0} />
        {!!progress.currentIntention && (
          <Text style={{ marginTop: 8, color: '#4b5563' }}>Intencja: {progress.currentIntention}</Text>
        )}
      </View>

      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' }}>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>Przyszłe terminy</Text>
        {upcoming.map((d, idx) => (
          <Text key={idx} style={{ paddingVertical: 4, color: '#374151' }}>
            {formatDateHuman(d)}
          </Text>
        ))}
      </View>

      <Modal visible={isStartModalVisible} transparent animationType="slide" onRequestClose={() => setStartModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Jak zaczynasz?</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <Pressable onPress={() => setStartMode('from-zero')} style={{ flex: 1, padding: 12, borderWidth: 1, borderColor: startMode === 'from-zero' ? '#1e40af' : '#e5e7eb', borderRadius: 8 }}>
                <Text style={{ textAlign: 'center', color: startMode === 'from-zero' ? '#1e40af' : '#111827' }}>Od zera</Text>
              </Pressable>
              <Pressable onPress={() => setStartMode('from-specific')} style={{ flex: 1, padding: 12, borderWidth: 1, borderColor: startMode === 'from-specific' ? '#1e40af' : '#e5e7eb', borderRadius: 8 }}>
                <Text style={{ textAlign: 'center', color: startMode === 'from-specific' ? '#1e40af' : '#111827' }}>Od konkretnej soboty</Text>
              </Pressable>
            </View>

            {startMode === 'from-specific' && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ marginBottom: 6 }}>Wybierz datę (YYYY-MM-DD)</Text>
                <TextInput
                  placeholder="2025-02-01"
                  value={specificSaturday}
                  onChangeText={setSpecificSaturday}
                  style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
                />
              </View>
            )}

            <View style={{ marginBottom: 12 }}>
              <Text style={{ marginBottom: 6 }}>Intencja</Text>
              <TextInput
                placeholder="Twoja intencja wynagradzająca"
                value={intention}
                onChangeText={setIntention}
                style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10 }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={() => setStartModalVisible(false)} style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' }}>
                <Text style={{ textAlign: 'center' }}>Anuluj</Text>
              </Pressable>
              <Pressable onPress={onConfirmStart} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#1e40af' }}>
                <Text style={{ textAlign: 'center', color: 'white' }}>Zapisz</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};