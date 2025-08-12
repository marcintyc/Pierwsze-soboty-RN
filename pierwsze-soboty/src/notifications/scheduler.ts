import * as Notifications from 'expo-notifications';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: reqStatus } = await Notifications.requestPermissionsAsync();
    return reqStatus === 'granted';
  }
  return true;
}

async function ensureAndroidChannel() {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Domyślne powiadomienia',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    sound: 'default',
  });
}

export async function scheduleFirstSaturdayReminders(): Promise<void> {
  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pierwsze Soboty – przypomnienie',
      body: 'Jutro pierwsza sobota. Przygotuj się do nabożeństwa.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 6,
      hour: 20,
      minute: 0,
    } as Notifications.WeeklyTriggerInput,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pierwsze Soboty – dziś!',
      body: 'Dziś pierwsza sobota. Rozpocznij nabożeństwo.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 7,
      hour: 8,
      minute: 0,
    } as Notifications.WeeklyTriggerInput,
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});