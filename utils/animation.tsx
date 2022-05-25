import {Easing, Animated, Platform, LayoutAnimation} from 'react-native';

const springConfig = {
  damping: 20,
  mass: 2,
  stiffness: 100,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
  useNativeDriver: Platform.OS !== 'web',
};

export const layoutConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export const timingAnimation = ({
  value,
  toValue,
  easing = Easing.linear,
  duration = 300,
  delay = 0,
}) => {
  return Animated.timing(value, {
    toValue,
    easing,
    duration,
    delay,
    useNativeDriver: Platform.OS !== 'web',
  });
};

export const springAnimation = ({value, toValue, duration = 300}) => {
  return Animated.spring(value, {
    toValue,
    ...springConfig,
  });
};
