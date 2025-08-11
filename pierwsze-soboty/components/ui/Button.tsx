import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', fullWidth = true, style }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const base = [styles.base, fullWidth && styles.fullWidth];

  const variantStyle =
    variant === 'primary'
      ? { backgroundColor: theme.tint, borderColor: theme.tint }
      : variant === 'outline'
      ? { backgroundColor: 'transparent', borderColor: theme.accentGold }
      : { backgroundColor: 'transparent', borderColor: theme.cardBorder };

  const textStyle =
    variant === 'primary'
      ? { color: '#fff' }
      : variant === 'outline'
      ? { color: theme.accentGold }
      : { color: theme.text };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, variantStyle, style, { opacity: pressed ? 0.9 : 1 }]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  text: { fontWeight: '700', fontSize: 16 },
});