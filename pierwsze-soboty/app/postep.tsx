import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startOfYear, endOfYear, eachMonthOfInterval, getDay, addDays, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { scheduleFirstSaturdayReminders } from '@/lib/notifications';
import Card from '@/components/ui/Card';

const STORAGE_KEY = 'pierwsze-soboty:completed';
const CYCLES_KEY = 'pierwsze-soboty:cycles';

type CompletedMap = Record<string, boolean>;

function getFirstSaturdays(year: number): string[] {
  const months = eachMonthOfInterval({ start: startOfYear(new Date(year, 0, 1)), end: endOfYear(new Date(year, 11, 31)) });
  const saturdays: string[] = [];
  for (const month of months) {
    const dayOfWeek = getDay(new Date(month.getFullYear(), month.getMonth(), 1));
    const offset = (6 - dayOfWeek + 7) % 7; // Saturday index is 6
    const firstSaturday = addDays(new Date(month.getFullYear(), month.getMonth(), 1), offset);
    saturdays.push(format(firstSaturday, 'yyyy-MM-dd'));
  }
  return saturdays;
}

function evaluateCycles(allDatesAsc: string[], completed: CompletedMap) {
  const doneFlags = allDatesAsc.map((d) => Boolean(completed[d]));
  let cycles = 0;
  let currentStreak = 0;
  for (let i = 0; i < doneFlags.length; i++) {
    if (doneFlags[i]) {
      currentStreak += 1;
      if (currentStreak === 5) {
        cycles += 1;
        currentStreak = 0;
      }
    } else {
      currentStreak = 0;
    }
  }
  return { cycles, currentStreak };
}

export default function PostepScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [completed, setCompleted] = useState<CompletedMap>({});
  const [storedCycles, setStoredCycles] = useState<number>(0);
  const year = new Date().getFullYear();
  const firstSaturdays = useMemo(() => getFirstSaturdays(year), [year]);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setCompleted(JSON.parse(json));
      const cyclesJson = await AsyncStorage.getItem(CYCLES_KEY);
      if (cyclesJson) setStoredCycles(Number(cyclesJson));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const { cycles, currentStreak } = useMemo(() => evaluateCycles(firstSaturdays, completed), [firstSaturdays, completed]);
  const totalCycles = Math.max(storedCycles, cycles);
  const currentCycleProgress = currentStreak;

  useEffect(() => {
    AsyncStorage.setItem(CYCLES_KEY, String(totalCycles));
  }, [totalCycles]);

  function toggleDate(date: string) {
    setCompleted((s) => ({ ...s, [date]: !s[date] }));
  }

  async function handleScheduleNotifications() {
    try {
      await scheduleFirstSaturdayReminders(9, 0);
    } catch {}
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, backgroundColor: theme.background, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720 }}>
        <Text style={[styles.title, { color: theme.tint }]}>Kalendarz postępu</Text>
        <Text style={{ color: theme.text, marginTop: 4, textAlign: 'center' }}>Pełne nabożeństwa ukończone: {totalCycles}</Text>
        <Text style={{ color: theme.text, marginTop: 2, textAlign: 'center' }}>Aktualny cykl: {currentCycleProgress}/5</Text>
        <View style={[styles.progressBar, { backgroundColor: theme.cardBorder, marginTop: 8 }]}>
          <View style={[styles.progressFill, { width: `${(currentCycleProgress / 5) * 100}%`, backgroundColor: theme.accentGold }]} />
        </View>

        <View style={{ marginTop: 16, gap: 10 }}>
          {firstSaturdays.map((iso, idx) => {
            const isDone = Boolean(completed[iso]);
            const d = new Date(`${iso}T00:00:00`);
            const label = format(d, 'd MMMM yyyy', { locale: pl });
            return (
              <Card key={iso} onPress={() => toggleDate(iso)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={[styles.heartCircle, { borderColor: isDone ? theme.accentGold : theme.cardBorder, backgroundColor: isDone ? theme.accentRose : 'transparent' }]}>
                    <Text style={{ fontSize: 18 }}>{isDone ? '💛' : '🤍'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: theme.text }]}>{idx + 1}. sobota — {label}</Text>
                    <Text style={{ color: theme.text, opacity: 0.7, fontSize: 12 }}>{iso}</Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Pressable onPress={handleScheduleNotifications} style={({ pressed }) => [{ marginTop: 16, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Ustaw przypomnienia na pierwsze soboty</Text>
        </Pressable>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.text, opacity: 0.8, textAlign: 'center' }}>Dotknij wiersz, aby odznaczyć pierwszą sobotę jako ukończoną. 5 kolejnych pierwszych sobót tworzy pełne nabożeństwo.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  progressBar: { marginTop: 8, height: 10, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  heartCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});