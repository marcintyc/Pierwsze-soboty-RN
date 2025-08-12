import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface HeartRowProps {
  countFilled: number; // 0..5
}

export const HeartRow: React.FC<HeartRowProps> = ({ countFilled }) => {
  const hearts = Array.from({ length: 5 }, (_, i) => i < countFilled);
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
      {hearts.map((filled, idx) => (
        <Text key={idx} style={{ fontSize: 28 }}>{filled ? '❤️' : '🤍'}</Text>
      ))}
    </View>
  );
};