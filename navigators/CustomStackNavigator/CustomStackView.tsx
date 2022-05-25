import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export const CustomStackView = ({ children, navigation, screen, route }) => {
  const { options: { containerBackgroundColor = 'transparent' } = {} } =
    screen || {};
  return (
    <BlurView
      tint="default"
      intensity={100}
      style={[
        styles.constainer,
        { backgroundColor: containerBackgroundColor },
      ]}>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  constainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
