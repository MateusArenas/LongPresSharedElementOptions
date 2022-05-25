// ./Navigators/CustomStackNavigator/index.js

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  useNavigationBuilder,
  createNavigatorFactory,
} from '@react-navigation/native';
import { StackRouter } from '@react-navigation/routers';
import isEqual from 'react-fast-compare';
import { CustomStackView } from './CustomStackView';

const initialScreenOptions = {
  gestureDirection: 'vertical',
  cardOverlayEnabled: true,
  gestureEnabled: false,
};

const CustomkNavigator = memo(
  ({
    initialRouteName,
    children,
    contentStyle,
    options,
    screenOptions = initialScreenOptions,
    ...rest
  }) => {
    const { state, navigation, descriptors } = useNavigationBuilder(
      StackRouter,
      {
        children,
        screenOptions,
        initialRouteName,
      }
    );

    return (
      <View style={styles.container}>
        {state.routes.map(route => {
          const screen = descriptors[route.key];
          return (
            <CustomStackView
              key={route.key}
              screen={screen}
              route={route}
              navigation={navigation}>
              {screen.render()}
            </CustomStackView>
          );
        })}
      </View>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default createNavigatorFactory(CustomkNavigator);
