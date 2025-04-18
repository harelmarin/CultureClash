import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const Timer = ({
  duration,
  remaining,
}: {
  duration: number;
  remaining: number;
}) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = 2 * Math.PI * normalizedRadius;

  const [progress, setProgress] = useState(remaining / duration);
  const startTimeRef = useRef(Date.now());
  const animationFrame = useRef<number>();

  useEffect(() => {
    const totalDurationMs = duration * 1000;
    const endTime = Date.now() + remaining * 1000;

    const animate = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, endTime - now);
      const newProgress = timeLeft / totalDurationMs;
      setProgress(newProgress);

      if (timeLeft > 0) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [duration, remaining]);

  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.wrapper}>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          stroke="#eee"
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={stroke}
        />
        <Circle
          stroke="#6C63FF"
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.timerText}>{Math.ceil(progress * duration)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Timer;
