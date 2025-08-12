import AsyncStorage from '@react-native-async-storage/async-storage';

export type StartMode = 'from-zero' | 'from-specific';

export interface ProgressState {
  startedAtIso?: string;
  selectedStartSaturdayIso?: string;
  currentIntention?: string;
  completedHearts: number; // 0..5
  lastUpdatedIso?: string;
}

const KEY = 'pierwsze_soboty_progress_v1';

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { completedHearts: 0 };
    const parsed = JSON.parse(raw) as ProgressState;
    if (typeof parsed.completedHearts !== 'number') parsed.completedHearts = 0;
    return parsed;
  } catch (e) {
    return { completedHearts: 0 };
  }
}

export async function saveProgress(progress: ProgressState): Promise<void> {
  const toSave: ProgressState = {
    ...progress,
    lastUpdatedIso: new Date().toISOString(),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(toSave));
}

export async function incrementHeart(): Promise<ProgressState> {
  const current = await loadProgress();
  const nextVal = Math.min(5, (current.completedHearts ?? 0) + 1);
  const next: ProgressState = { ...current, completedHearts: nextVal };
  await saveProgress(next);
  return next;
}

export async function resetHearts(): Promise<ProgressState> {
  const current = await loadProgress();
  const next: ProgressState = { ...current, completedHearts: 0 };
  await saveProgress(next);
  return next;
}