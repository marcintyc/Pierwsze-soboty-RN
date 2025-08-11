import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getFirstSaturdaysOfYear } from './firstSaturday';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    const ask = await Notifications.requestPermissionsAsync();
    return ask.status === 'granted';
  }
  return true;
}

export async function scheduleFirstSaturdayReminders(hour = 9, minute = 0) {
  if (Platform.OS === 'web') return [] as string[];
  const granted = await requestNotificationPermissions();
  if (!granted) return [] as string[];

  const now = new Date();
  const year = now.getFullYear();
  const dates = getFirstSaturdaysOfYear(year)
    .map((d) => new Date(`${d}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`))
    .filter((d) => d.getTime() > now.getTime());

  const ids: string[] = [];
  for (const when of dates) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pierwsza sobota miesiąca',
        body: 'Pamiętaj o nabożeństwie wynagradzającym Niepokalanemu Sercu Maryi.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: when,
    });
    ids.push(id);
  }
  return ids;
}

// Ustaw kanał Android dla lepszej kontroli dźwięków
Notifications.setNotificationChannelAsync?.('pierwsze-soboty', {
  name: 'Przypomnienia Pierwsze Soboty',
  importance: Notifications.AndroidImportance.HIGH,
  sound: 'default',
});