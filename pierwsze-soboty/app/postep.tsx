import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { scheduleFirstSaturdayReminders } from '@/lib/notifications';
import Card from '@/components/ui/Card';
import { getFirstSaturdaysBetweenYears } from '@/lib/firstSaturday';

const STORAGE_KEY = 'pierwsze-soboty:completed';
const CYCLES_KEY = 'pierwsze-soboty:cycles';

type CompletedMap = Record<string, boolean>;

function evaluateCyclesUpToToday(datesAsc: string[], completed: CompletedMap, todayISO: string) {
  let cycles = 0;
  let streak = 0;
  let lastIndex = datesAsc.findIndex((iso) => iso > todayISO) - 1;
  if (lastIndex < 0) lastIndex = datesAsc.length - 1; // jeśli wszystkie <= dziś

  for (let i = 0; i <= lastIndex; i++) {
    const iso = datesAsc[i];
    if (completed[iso]) {
      streak += 1;
      if (streak === 5) {
        cycles += 1;
        streak = 0;
      }
    } else {
      streak = 0;
    }
  }
  return { cycles, currentStreak: streak };
}

export default function PostepScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [completed, setCompleted] = useState<CompletedMap>({});
  const [storedCycles, setStoredCycles] = useState<number>(0);

  const now = new Date();
  const todayISO = format(now, 'yyyy-MM-dd');
  const yearsSpan = useMemo(() => {
    const y = now.getFullYear();
    return [y - 1, y, y + 1] as const;
  }, [now]);
  const allFirstSaturdays = useMemo(() => {
    const dates = getFirstSaturdaysBetweenYears(yearsSpan[0], yearsSpan[2]);
    return dates.sort();
  }, [yearsSpan]);

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

  const { cycles, currentStreak } = useMemo(
    () => evaluateCyclesUpToToday(allFirstSaturdays, completed, todayISO),
    [allFirstSaturdays, completed, todayISO]
  );
  const totalCycles = Math.max(storedCycles, cycles);

  useEffect(() => {
    AsyncStorage.setItem(CYCLES_KEY, String(totalCycles));
  }, [totalCycles]);

  function toggleDate(date: string) {
    setCompleted((s) => ({ ...s, [date]: !s[date] }));
  }

  function Heart({ filled }: { filled: boolean }) {
    return (
      <View style={[styles.heartCircle, { borderColor: filled ? theme.accentGold : theme.cardBorder, backgroundColor: filled ? theme.accentRose : 'transparent' }]}>
        <Text style={{ fontSize: 18 }}>{filled ? '💛' : '🤍'}</Text>
      </View>
    );
  }

  const nextFive = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => i < currentStreak);
  }, [currentStreak]);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, backgroundColor: theme.background, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720 }}>
        <Text style={[styles.title, { color: theme.tint }]}>Kalendarz postępu</Text>
        <Text style={{ color: theme.text, marginTop: 4, textAlign: 'center' }}>Pełne nabożeństwa ukończone: {totalCycles}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10 }}>
          {nextFive.map((filled, i) => (
            <Heart key={i} filled={filled} />
          ))}
        </View>

        <View style={{ marginTop: 18, gap: 12 }}>
          {allFirstSaturdays.map((iso) => {
            const isDone = Boolean(completed[iso]);
            const d = new Date(`${iso}T00:00:00`);
            const label = format(d, 'd MMMM yyyy (EEEE)', { locale: pl });
            return (
              <Card key={iso} onPress={() => toggleDate(iso)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Heart filled={isDone} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: theme.text }]}>{label}</Text>
                    <Text style={{ color: theme.text, opacity: 0.7, fontSize: 12 }}>{iso}</Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Pressable onPress={async () => { try { await scheduleFirstSaturdayReminders(9, 0); } catch {} }} style={({ pressed }) => [{ marginTop: 16, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: theme.tint, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Ustaw przypomnienia na pierwsze soboty</Text>
        </Pressable>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.text, opacity: 0.8, textAlign: 'center' }}>Dotknij wiersz, aby odznaczyć pierwszą sobotę jako ukończoną. 5 kolejnych pierwszych sobót tworzy pełne nabożeństwo (serca u góry).</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '700' },
  heartCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});