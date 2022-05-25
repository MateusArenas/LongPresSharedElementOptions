import {Dimensions, LayoutAnimation} from 'react-native';

const {width, height} = Dimensions.get('window');

export const theme = {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  CARD_WIDTH: width - 80,
  CARD_HEIGHT: height/2,
  CARD_DETAIL_HEIGHT: height/2 + 200,
  CARD_BORDER: 12,
  HEADER_HEIGHT: 120,
  SPACE: 15,
  primaryColor: '#00b4c5',
};
