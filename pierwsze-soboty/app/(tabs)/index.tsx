import { Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/ui/Button';
import { useMemo } from 'react';
import { getNextFirstSaturdayFrom } from '@/lib/firstSaturday';
import { differenceInCalendarDays, format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { scheduleFirstSaturdayReminders } from '@/lib/notifications';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const nextFirstSaturday = useMemo(() => getNextFirstSaturdayFrom(new Date()), []);
  const daysLeft = useMemo(() => Math.max(0, differenceInCalendarDays(nextFirstSaturday, new Date())), [nextFirstSaturday]);

  return (
    <LinearGradient colors={[theme.background, theme.card]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
          <View style={styles.centered}>
            <Image source={require('@/assets/images/icon.png')} style={styles.heroImage} />
            <Text style={[styles.title, { color: theme.tint }]}>Pierwsze Soboty</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>Nabożeństwo wynagradzające Niepokalanemu Sercu Maryi</Text>
          </View>

          <Text style={[styles.paragraph, { color: theme.text }]}>Tym, którzy przez pięć miesięcy w pierwsze soboty odprawią nabożeństwa, w stanie łaski i w intencji wynagradzającej Jej Niepokalanemu Sercu, wyjednam łaski potrzebne do zbawienia.</Text>

          <View style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ color: theme.text, fontWeight: '700' }}>Do najbliższej pierwszej soboty: {daysLeft} dni</Text>
            <Text style={{ color: theme.text, opacity: 0.8 }}>{format(nextFirstSaturday, 'd MMMM yyyy (EEEE)', { locale: pl })}</Text>
          </View>

          <View style={styles.actions}>
            <Link href="/warunki" asChild>
              <Button title="Warunki" variant="primary" />
            </Link>
            <Link href="/start" asChild>
              <Button title="Rozpocznij nabożeństwo" variant="outline" />
            </Link>
            <Link href="/postep" asChild>
              <Button title="Kalendarz postępu" variant="ghost" />
            </Link>
            <Link href="/informacje" asChild>
              <Button title="Informacje" variant="ghost" />
            </Link>
            <Button title="Ustaw przypomnienia" variant="outline" onPress={() => scheduleFirstSaturdayReminders(9, 0)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: 'center' },
  centered: { alignItems: 'center', width: '100%', maxWidth: 720 },
  heroImage: { width: 96, height: 96, borderRadius: 48, marginTop: 12, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: '800' },
  subtitle: { fontSize: 16, marginTop: 6, opacity: 0.9, textAlign: 'center' },
  paragraph: { fontSize: 16, marginTop: 16, lineHeight: 24, width: '100%', maxWidth: 720, textAlign: 'center' },
  actions: { width: '100%', maxWidth: 520, marginTop: 24, gap: 12 },
});
