import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { getCountdownParts } from '../utils/dates';

interface CountdownProps {
  target: Date;
}

export const Countdown: React.FC<CountdownProps> = ({ target }) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, seconds } = getCountdownParts(target, now);
  return (
    <Text style={{ fontSize: 16, textAlign: 'center' }}>
      {days} dni {hours} godz. {minutes} min {seconds} s
    </Text>
  );
};