import React from 'react';
import { Image, View, Text } from 'react-native';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export const Hero: React.FC<HeroProps> = ({ title = 'Nabożeństwo pierwszych sobót', subtitle = 'Przygotuj serce i zacznij w odpowiednim czasie' }) => {
  return (
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Our_Lady_of_Fatima_2.jpg/480px-Our_Lady_of_Fatima_2.jpg' }}
        style={{ width: 160, height: 160, borderRadius: 12, marginBottom: 8 }}
        resizeMode="cover"
      />
      <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 14, color: '#555', textAlign: 'center', marginTop: 4 }}>{subtitle}</Text>
    </View>
  );
};