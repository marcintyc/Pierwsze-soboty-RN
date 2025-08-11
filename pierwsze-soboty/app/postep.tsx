import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarList, DateData } from 'react-native-calendars';
import { startOfYear, endOfYear, eachMonthOfInterval, getDay, addDays, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { scheduleFirstSaturdayReminders } from '@/lib/notifications';

const STORAGE_KEY = 'pierwsze-soboty:completed';

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

export default function PostepScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [completed, setCompleted] = useState<CompletedMap>({});
  const year = new Date().getFullYear();
  const firstSaturdays = useMemo(() => getFirstSaturdays(year), [year]);
  const countDone = firstSaturdays.filter((d) => completed[d]).length;
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setCompleted(JSON.parse(json));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

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
      const ids = await scheduleFirstSaturdayReminders(9, 0);
      setNotifStatus(`Ustawiono ${ids.length} przypomnień na pozostałe pierwsze soboty.`);
    } catch (e) {
      setNotifStatus('Nie udało się ustawić powiadomień.');
    }
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, backgroundColor: theme.background }}>
      <Text style={[styles.title, { color: theme.tint }]}>Kalendarz postępu</Text>
      <Text style={{ color: theme.text, marginTop: 4 }}>Pierwsze soboty roku {year}</Text>

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
          locale={'pl'}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ color: theme.text, fontWeight: '700' }}>Ukończono {countDone}/5 sobót</Text>
        <View style={[styles.progressBar, { backgroundColor: theme.cardBorder }]}>
          <View style={[styles.progressFill, { width: `${(countDone / 5) * 100}%`, backgroundColor: theme.accentGold }]} />
        </View>
        <View style={styles.stepsRow}>
          {Array.from({ length: 5 }).map((_, i) => {
            const date = firstSaturdays[i];
            const isDone = completed[date];
            return (
              <Pressable key={date} onPress={() => toggleDate(date)}
                style={[styles.step, { borderColor: isDone ? theme.accentGold : theme.cardBorder, backgroundColor: theme.card }]}>
                <Text style={{ fontSize: 18 }}>{isDone ? '💛' : '🤍'}</Text>
              </Pressable>
            );
          })}
        </View>
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
      {notifStatus && <Text style={{ marginTop: 8, color: theme.text }}>{notifStatus}</Text>}

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: theme.text, opacity: 0.8 }}>
          Dotknij wybraną sobotę w kalendarzu lub ikonę serca, aby odznaczyć jako ukończoną.
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
  stepsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  step: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
  },
});