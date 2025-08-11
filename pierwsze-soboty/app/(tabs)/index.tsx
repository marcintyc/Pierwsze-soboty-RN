import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      style={{ flex: 1 }}>
      <Text style={[styles.title, { color: theme.tint }]}>Pierwsze Soboty</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Nabożeństwo wynagradzające Niepokalanemu Sercu Maryi</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>
        Tym, którzy przez pięć miesięcy w pierwsze soboty odprawią nabożeństwa,
        w stanie łaski i w intencji wynagradzającej Jej Niepokalanemu Sercu,
        wyjednam łaski potrzebne do zbawienia.
      </Text>

      <View style={styles.buttons}>
        <Link href="/warunki" asChild>
          <Pressable style={({ pressed }) => [styles.button, { backgroundColor: theme.tint, opacity: pressed ? 0.8 : 1 }]}>
            <Text style={styles.buttonText}>Rozpocznij nabożeństwo</Text>
          </Pressable>
        </Link>
        <Link href="/postep" asChild>
          <Pressable style={({ pressed }) => [styles.buttonOutline, { borderColor: theme.accentGold, opacity: pressed ? 0.8 : 1 }]}>
            <Text style={[styles.buttonTextOutline, { color: theme.accentGold }]}>Kalendarz postępu</Text>
          </Pressable>
        </Link>
        <Link href="/informacje" asChild>
          <Pressable style={({ pressed }) => [styles.buttonGhost, { borderColor: theme.accentRose, opacity: pressed ? 0.8 : 1 }]}>
            <Text style={[styles.buttonTextOutline, { color: theme.accentRose }]}>Informacje</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
  },
  paragraph: {
    fontSize: 16,
    marginTop: 16,
    lineHeight: 24,
  },
  buttons: {
    marginTop: 28,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutline: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonGhost: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonTextOutline: {
    fontWeight: '700',
    fontSize: 16,
  },
});
