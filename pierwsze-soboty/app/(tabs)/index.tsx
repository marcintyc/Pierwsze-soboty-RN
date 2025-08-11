import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <LinearGradient
      colors={[theme.background, theme.card]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={[styles.container]} style={{ flex: 1 }}>
        <View style={styles.hero}>
          <Image source={require('@/assets/images/icon.png')} style={styles.heroImage} />
          <Text style={[styles.title, { color: theme.tint }]}>Pierwsze Soboty</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>Nabożeństwo wynagradzające Niepokalanemu Sercu Maryi</Text>
        </View>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    marginTop: 24,
  },
  heroImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
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
