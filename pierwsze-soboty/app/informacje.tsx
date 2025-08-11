import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function InformacjeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, backgroundColor: theme.background }}>
      <Text style={[styles.title, { color: theme.tint }]}>O nabożeństwie pierwszych sobót</Text>

      <Text style={[styles.paragraph, { color: theme.text }]}>
        Nabożeństwo pierwszych sobót miesiąca zostało przekazane w objawieniach fatimskich (1917)
        i doprecyzowane w 1925 roku siostrze Łucji. Polega na spełnieniu czterech warunków w pięć kolejnych
        pierwszych sobót miesiąca w intencji wynagradzającej Niepokalanemu Sercu Maryi.
      </Text>

      <Text style={[styles.heading, { color: theme.accentGold }]}>Pięć zniewag wobec Niepokalanego Serca Maryi</Text>
      <View style={{ gap: 6 }}>
        <Text style={{ color: theme.text }}>1. Przeciw Jej Niepokalanemu Poczęciu.</Text>
        <Text style={{ color: theme.text }}>2. Przeciw Jej Dziewictwu.</Text>
        <Text style={{ color: theme.text }}>3. Przeciw Jej Bożemu Macierzyństwu i równoczesnemu uznaniu Jej tylko jako matki człowieka.</Text>
        <Text style={{ color: theme.text }}>4. Wpajanie obojętności, pogardy lub nienawiści do Maryi w serca dzieci.</Text>
        <Text style={{ color: theme.text }}>5. Znieważanie Jej świętych wizerunków.</Text>
      </View>

      <Text style={[styles.heading, { color: theme.accentGold, marginTop: 16 }]}>Modlitwy</Text>
      <View style={{ gap: 8 }}>
        <Text style={[styles.subheading, { color: theme.text }]}>Akt wynagradzający</Text>
        <Text style={{ color: theme.text, opacity: 0.9 }}>
          O mój Jezu, przebacz nam nasze grzechy, zachowaj nas od ognia piekielnego, zaprowadź wszystkie dusze do nieba
          i dopomóż szczególnie tym, którzy najbardziej potrzebują Twojego miłosierdzia.
        </Text>
      </View>

      <Text style={[styles.heading, { color: theme.accentGold, marginTop: 16 }]}>FAQ</Text>
      <View style={{ gap: 8 }}>
        <Text style={[styles.subheading, { color: theme.text }]}>Czy można odprawić nabożeństwo w niedzielę?</Text>
        <Text style={{ color: theme.text, opacity: 0.9 }}>
          W wyjątkowych sytuacjach — za zgodą kapłana — praktykę można przenieść na niedzielę.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800' },
  heading: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  subheading: { fontSize: 16, fontWeight: '700' },
  paragraph: { marginTop: 8, lineHeight: 22 },
});