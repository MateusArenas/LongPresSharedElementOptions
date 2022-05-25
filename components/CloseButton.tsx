import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from 'react-native';

const CloseImage = require('../assets/close.png');

export const CloseButton = ({ style, onPress }) => {
  return (
    <TouchableWithoutFeedback style={styles.iconButton} onPress={onPress}>
      <Animated.Image resizeMode="cover" source={CloseImage} style={[styles.icon, style]} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  icon: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 35,
    right: 20,
    borderRadius: 80,
    width: 40,
    height: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
