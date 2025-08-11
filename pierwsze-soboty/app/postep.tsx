import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarList, DateData } from 'react-native-calendars';
import { startOfYear, endOfYear, eachMonthOfInterval, getDay, addDays, format } from 'date-fns';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { scheduleFirstSaturdayReminders } from '@/lib/notifications';

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
        currentStreak = 0; // reset for potencjalny kolejny cykl
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

  const markedDates = useMemo(() => {
    const marks: any = {};
    for (const date of firstSaturdays) {
      if (completed[date]) {
        marks[date] = { marked: true, selected: true, selectedColor: theme.accentGold, dotColor: theme.accentGold };
      } else {
        marks[date] = { marked: true, dotColor: theme.tint };
      }
    }
    return marks;
  }, [firstSaturdays, completed, theme]);

  function toggleDate(date: string) {
    setCompleted((s) => ({ ...s, [date]: !s[date] }));
  }

  async function handleScheduleNotifications() {
    try {
      await scheduleFirstSaturdayReminders(9, 0);
    } catch {}
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, backgroundColor: theme.background }}>
      <Text style={[styles.title, { color: theme.tint }]}>Kalendarz postępu</Text>
      <Text style={{ color: theme.text, marginTop: 4 }}>Pełne nabożeństwa ukończone: {totalCycles}</Text>
      <Text style={{ color: theme.text, marginTop: 2 }}>Aktualny cykl: {currentCycleProgress}/5</Text>
      <View style={[styles.progressBar, { backgroundColor: theme.cardBorder, marginTop: 8 }]}>
        <View style={[styles.progressFill, { width: `${(currentCycleProgress / 5) * 100}%`, backgroundColor: theme.accentGold }]} />
      </View>

      <View style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: theme.cardBorder }}>
        <CalendarList
          pastScrollRange={0}
          futureScrollRange={0}
          scrollEnabled={false}
          showScrollIndicator={false}
          horizontal={false}
          markedDates={markedDates}
          onDayPress={(day: DateData) => {
            if (firstSaturdays.includes(day.dateString)) toggleDate(day.dateString);
          }}
          theme={{
            calendarBackground: theme.background,
            dayTextColor: theme.text,
            monthTextColor: theme.text,
            textDisabledColor: '#94a3b8',
          }}
        />
      </View>

      <Pressable onPress={handleScheduleNotifications}
        style={({ pressed }) => [{
          marginTop: 16,
          paddingVertical: 12,
          alignItems: 'center',
          borderRadius: 12,
          backgroundColor: theme.tint,
          opacity: pressed ? 0.85 : 1,
        }]}>
        <Text style={{ color: 'white', fontWeight: '700' }}>Ustaw przypomnienia na pierwsze soboty</Text>
      </Pressable>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: theme.text, opacity: 0.8 }}>
          Dotknij wybraną sobotę w kalendarzu, aby odznaczyć jako ukończoną. 5 kolejnych pierwszych sobót tworzy pełne nabożeństwo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  progressBar: {
    marginTop: 8,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});