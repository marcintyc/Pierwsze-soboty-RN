import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const START_KEY = 'pierwsze-soboty:startChoice';

type StartChoice = {
  mode: 'zero' | 'nth';
  nth?: number; // 1..5
  intention?: string;
  savedAt: string; // ISO
};

const INTENTIONS: Record<number, string> = {
  1: 'Wynagradzająco za zniewagi przeciw Niepokalanemu Poczęciu Maryi.',
  2: 'Wynagradzająco za zniewagi przeciw Dziewictwu Maryi.',
  3: 'Wynagradzająco za zniewagi przeciw Bożemu Macierzyństwu Maryi i uznaniu Jej tylko za matkę człowieka.',
  4: 'Wynagradzająco za wpajanie obojętności, pogardy lub nienawiści do Maryi w serca dzieci.',
  5: 'Wynagradzająco za znieważanie świętych wizerunków Maryi.',
};

export default function StartScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [mode, setMode] = useState<'zero' | 'nth'>('zero');
  const [nth, setNth] = useState<number>(1);

  const intention = useMemo(() => (mode === 'nth' ? INTENTIONS[nth] : 'Wynagradzająco Niepokalanemu Sercu Maryi.'), [mode, nth]);

  async function handleSave() {
    const choice: StartChoice = {
      mode,
      nth: mode === 'nth' ? nth : undefined,
      intention,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(START_KEY, JSON.stringify(choice));
    router.replace('/warunki');
  }

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(START_KEY);
      if (json) {
        const prev = JSON.parse(json) as StartChoice;
        setMode(prev.mode);
        if (prev.nth) setNth(prev.nth);
      }
    })();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, backgroundColor: theme.background, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720, gap: 12 }}>
        <Text style={[styles.title, { color: theme.tint }]}>Rozpocznij nabożeństwo</Text>

        <Card onPress={() => setMode('zero')}>
          <View style={styles.rowBetween}>
            <Text style={[styles.optionTitle, { color: theme.text }]}>Zaczynam od zera</Text>
            <View style={[styles.radio, { borderColor: theme.tint, backgroundColor: mode === 'zero' ? theme.tint : 'transparent' }]} />
          </View>
          <Text style={[styles.optionHint, { color: theme.text }]}>Domyślna intencja wynagradzająca. Nie resetuje Twojego postępu.</Text>
        </Card>

        <Card onPress={() => setMode('nth')}>
          <View style={styles.rowBetween}>
            <Text style={[styles.optionTitle, { color: theme.text }]}>Zaczynam od wybranej soboty</Text>
            <View style={[styles.radio, { borderColor: theme.tint, backgroundColor: mode === 'nth' ? theme.tint : 'transparent' }]} />
          </View>
          <View style={styles.nthRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Button key={i} title={`${i}`} variant={i === nth ? 'primary' : 'ghost'} fullWidth={false} onPress={() => setNth(i)} />
            ))}
          </View>
          <Text style={[styles.optionHint, { color: theme.text }]}>Wybierz, od której z pięciu pierwszych sobót chcesz zacząć.</Text>
        </Card>

        <Card>
          <Text style={[styles.subheading, { color: theme.accentGold }]}>Intencja</Text>
          <Text style={{ color: theme.text, marginTop: 6 }}>{intention}</Text>
        </Card>

        <Button title="Zapisz i przejdź do warunków" variant="primary" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionTitle: { fontSize: 16, fontWeight: '700' },
  optionHint: { marginTop: 6, opacity: 0.85 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  nthRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  subheading: { fontSize: 16, fontWeight: '800' },
});