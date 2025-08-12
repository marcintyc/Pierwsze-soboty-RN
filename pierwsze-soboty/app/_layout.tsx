import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="warunki" options={{ title: 'Warunki' }} />
        <Stack.Screen name="postep" options={{ title: 'Kalendarz postępu' }} />
        <Stack.Screen name="informacje" options={{ title: 'Informacje' }} />
        <Stack.Screen name="start" options={{ title: 'Rozpocznij nabożeństwo' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
