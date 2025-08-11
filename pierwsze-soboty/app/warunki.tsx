import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, ScrollView } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

const CONDITIONS = [
  { key: 'confession', title: 'Spowiedź święta', subtitle: 'W pierwszą sobotę miesiąca, z intencją wynagradzającą', icon: '✝️' },
  { key: 'communion', title: 'Komunia święta', subtitle: 'Przyjęcie Komunii świętej w pierwszą sobotę', icon: '🕊️' },
  { key: 'rosary', title: 'Różaniec', subtitle: 'Jedna część – pięć tajemnic', icon: '📿' },
  { key: 'meditation', title: 'Rozmyślanie', subtitle: '15 minut nad tajemnicami różańca', icon: '💙' },
] as const;

type ConditionKey = typeof CONDITIONS[number]['key'];

export default function WarunkiScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [checked, setChecked] = useState<Record<ConditionKey, boolean>>({
    confession: false,
    communion: false,
    rosary: false,
    meditation: false,
  });

  const progress = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
  const allDone = progress === CONDITIONS.length;
  const glow = useMemo(() => new Animated.Value(0), []);

  if (allDone) {
    Animated.timing(glow, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      style={{ flex: 1 }}>
      <Text style={[styles.title, { color: theme.tint }]}>Warunki nabożeństwa</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Odznacz wykonane warunki dla tej pierwszej soboty.</Text>

      <View style={styles.list}>
        {CONDITIONS.map((item) => {
          const isOn = checked[item.key];
          return (
            <Pressable key={item.key} onPress={() => setChecked((s) => ({ ...s, [item.key]: !s[item.key] }))}
              style={({ pressed }) => [
                styles.card,
                { borderColor: isOn ? theme.accentGold : theme.cardBorder, backgroundColor: theme.card, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.cardSubtitle, { color: theme.text, opacity: 0.8 }]}>{item.subtitle}</Text>
              </View>
              <View style={[styles.checkbox, { borderColor: isOn ? theme.tint : theme.cardBorder, backgroundColor: isOn ? theme.tint : 'transparent' }]} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressBar, { backgroundColor: theme.cardBorder }]}>
          <Animated.View style={[styles.progressFill, { width: `${(progress / CONDITIONS.length) * 100}%`, backgroundColor: theme.tint }]} />
        </View>
        <Text style={{ color: theme.text, marginLeft: 12 }}>Ukończono {progress}/{CONDITIONS.length}</Text>
      </View>

      {allDone && (
        <Animated.View style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: theme.accentGold,
          backgroundColor: theme.card,
          shadowColor: theme.accentRose,
          shadowOpacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.6] }) as unknown as number,
        }}>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '700', color: theme.accentGold }}>
            Dziękujemy! Wszystkie warunki odznaczone.
          </Text>
          <Text style={{ textAlign: 'center', marginTop: 8, color: theme.text }}>
            Niepokalane Serce Maryi – prowadź nas.
          </Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
  },
  list: {
    marginTop: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});