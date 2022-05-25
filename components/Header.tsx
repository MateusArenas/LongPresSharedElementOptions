
import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Image} from 'react-native';
import {theme} from '../utils/theme';

const TitleImage = require('../assets/title.png');
const NextIcon = require('../assets/next.png');
const PreviousIcon = require('../assets/previous.png');

const {HEADER_HEIGHT, SCREEN_WIDTH} = theme;
export const Header = ({item, onPress, style, page, onNext, onPrevious}) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback disabled={page <= 1} onPress={onPrevious}>
        <Image
          style={[styles.icon, {opacity: page > 1 ? 1 : 0.5}]}
          source={PreviousIcon}
          resizeMode="contain"
        />
      </TouchableWithoutFeedback>
      <Image style={[styles.image]} source={TitleImage} resizeMode="contain" />
      <TouchableWithoutFeedback onPress={onNext}>
        <Image style={[styles.icon]} source={NextIcon} resizeMode="contain" />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    width: 250,
    height: HEADER_HEIGHT - 20,
  },
  icon: {
    width: 45,
    height: 45,
  },
});
