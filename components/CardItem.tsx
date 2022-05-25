import React, {useState, memo} from 'react';
import {
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';
import isEqual from 'react-fast-compare';
import {theme} from '../utils/theme';
import {timingAnimation} from '../utils/animation';

const {Value} = Animated;
const {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_BORDER,
  CARD_DETAIL_HEIGHT,
  SPACE,
  secondaryColor,
  SCREEN_WIDTH,
} = theme;

export const CardItem = memo(
  ({item, onPress, style, disable = false, selectedItem, onLongPress}) => {
    const {image, name} = item;
    const [position, setPosition] = useState({x: 0, y: 0});
    const pressValue = new Value(0);

    const handleLayout = event => {
      const {x, y} = event.nativeEvent.layout;
      setPosition({x, y});
    };

    const handlePressIn = () => {
      timingAnimation({value: pressValue, toValue: 100}).start();
    };

    const handlePressOut = () => {
      timingAnimation({
        value: pressValue,
        toValue: 0,
        duration: 150,
      }).start();
    };

    const handlePress = () => {
      onPress(item, position);
    };

    const scaleInterPolate = pressValue.interpolate({
      inputRange: [-1, 0, 100, 101],
      outputRange: [1, 1, 0.9, 0.9],
      extrapolate: 'clamp',
    });

    const scaleImageInterPolate = pressValue.interpolate({
      inputRange: [-1, 0, 100, 101],
      outputRange: [1, 1, 1.1, 1.1],
      extrapolate: 'clamp',
    });

    const animatedStyle = {
      transform: [{scale: scaleInterPolate}],
      opacity: selectedItem === item.id ? 0 : 1,
    };

    const imageStyle = {
      transform: [{scale: scaleImageInterPolate}],
    };

    return (
      <TouchableWithoutFeedback
        onPressIn={() => !disable && handlePressIn()}
        onPressOut={() => !disable && handlePressOut()}
        onPress={()=> !disable && handlePress()}
        onLongPress={onLongPress}
        onLayout={handleLayout}
        activeOpacity={1}>
        <Animated.View style={[styles.container, animatedStyle, style]}>
          <Animated.Image
            resizeMode="cover"
            style={[styles.image, imageStyle]}
            source={{
              uri: image,
            }}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps),
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_BORDER,
    marginBottom: SPACE,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: CARD_DETAIL_HEIGHT,
  },
  nameContainer: {
    width: '100%',
    backgroundColor: 'rgba(32, 35, 41, 0.8)',
    position: 'absolute',
    paddingLeft: SPACE,
    paddingVertical: SPACE,
    left: 0,
    bottom: 0,
  },
  name: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
    textShadowColor: secondaryColor,
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 3,
  },
});
