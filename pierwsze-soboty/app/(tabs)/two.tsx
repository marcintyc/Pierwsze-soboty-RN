import { View, Text, StyleSheet } from 'react-native';

export default function ProgressTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Postęp</Text>
      <Text>Przejdź do „Kalendarz postępu” z ekranu głównego.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
});
