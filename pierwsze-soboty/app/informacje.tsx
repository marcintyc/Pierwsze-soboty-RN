import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function InformacjeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, backgroundColor: theme.background, alignItems: 'center' }}>
      <View style={{ width: '100%', maxWidth: 720 }}>
        <Text style={[styles.title, { color: theme.tint }]}>O nabożeństwie pierwszych sobót</Text>

        <Text style={[styles.paragraph, { color: theme.text }]}>Nabożeństwo pierwszych sobót miesiąca zostało przekazane w objawieniach fatimskich (1917) i doprecyzowane w 1925 roku siostrze Łucji. Polega na spełnieniu czterech warunków w pięć kolejnych pierwszych sobót miesiąca w intencji wynagradzającej Niepokalanemu Sercu Maryi.</Text>

        <View style={[styles.sectionHeader, { borderColor: theme.accentGold }]}>
          <Text style={[styles.heading, { color: theme.accentGold }]}>Pięć zniewag wobec Niepokalanego Serca Maryi</Text>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={{ color: theme.text }}>1. Przeciw Jej Niepokalanemu Poczęciu.</Text>
          <Text style={{ color: theme.text }}>2. Przeciw Jej Dziewictwu.</Text>
          <Text style={{ color: theme.text }}>3. Przeciw Jej Bożemu Macierzyństwu i równoczesnemu uznaniu Jej tylko jako matki człowieka.</Text>
          <Text style={{ color: theme.text }}>4. Wpajanie obojętności, pogardy lub nienawiści do Maryi w serca dzieci.</Text>
          <Text style={{ color: theme.text }}>5. Znieważanie Jej świętych wizerunków.</Text>
        </View>

        <View style={[styles.sectionHeader, { borderColor: theme.accentGold }]}>
          <Text style={[styles.heading, { color: theme.accentGold }]}>Modlitwy</Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={[styles.subheading, { color: theme.text }]}>Akt wynagradzający</Text>
          <Text style={{ color: theme.text, opacity: 0.9 }}>O mój Jezu, przebacz nam nasze grzechy, zachowaj nas od ognia piekielnego, zaprowadź wszystkie dusze do nieba i dopomóż szczególnie tym, którzy najbardziej potrzebują Twojego miłosierdzia.</Text>
        </View>

        <View style={[styles.sectionHeader, { borderColor: theme.accentGold }]}>
          <Text style={[styles.heading, { color: theme.accentGold }]}>FAQ</Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text style={[styles.subheading, { color: theme.text }]}>Czy można odprawić nabożeństwo w niedzielę?</Text>
          <Text style={{ color: theme.text, opacity: 0.9 }}>W wyjątkowych sytuacjach — za zgodą kapłana — praktykę można przenieść na niedzielę.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  heading: { fontSize: 18, fontWeight: '800' },
  subheading: { fontSize: 16, fontWeight: '700' },
  paragraph: { marginTop: 10, lineHeight: 24, textAlign: 'center' },
  sectionHeader: { borderLeftWidth: 4, paddingLeft: 10, marginTop: 18, marginBottom: 8 },
});