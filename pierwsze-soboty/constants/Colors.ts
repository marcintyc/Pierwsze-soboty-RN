const maryBlue = '#2a6fdb';
const maryBlueLight = '#6ea8fe';
const maryGold = '#c9a227';
const maryRose = '#f3c7cf';
const white = '#ffffff';
const nearBlack = '#0f172a';

export default {
  light: {
    text: nearBlack,
    background: '#eef5ff',
    tint: maryBlue,
    tabIconDefault: '#b6c2ff',
    tabIconSelected: maryBlue,
    card: '#f7faff',
    cardBorder: maryBlueLight,
    accentGold: maryGold,
    accentRose: maryRose,
  },
  dark: {
    text: white,
    background: '#0b1020',
    tint: maryBlueLight,
    tabIconDefault: '#64748b',
    tabIconSelected: maryBlueLight,
    card: '#0f172a',
    cardBorder: '#1e293b',
    accentGold: maryGold,
    accentRose: '#7a5060',
  },
};
