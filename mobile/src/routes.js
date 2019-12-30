import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from '~/pages/SignIn';
import Dashboard from '~/pages/Dashboard';
import Help from '~/pages/Help';
import Answer from '~/pages/Answer';
import Question from '~/pages/Question';

const tabBarIcon = ({ tintColor }) => (
  <Icon name="live-help" size={20} color={tintColor} />
);

export default (signedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        SignIn,
        App: {
          screen: createBottomTabNavigator(
            {
              Dashboard,
              Help: {
                screen: createStackNavigator(
                  {
                    Help,
                    Answer,
                    Question,
                  },
                  {
                    defaultNavigationOptions: {
                      headerTransparent: true,
                      headerTintColor: '#FFF',
                      headerLeftContainerStyle: {
                        marginLeft: 20,
                      },
                    },
                  }
                ),
                navigationOptions: {
                  tabBarLabel: 'Pedir ajuda',
                  tabBarIcon,
                },
              },
            },
            {
              resetOnBlur: true,
              tabBarOptions: {
                keyboardHidesTabBar: true,
                activeTintColor: '#EE4E62',
                inactiveTintColor: '#999999',
              },
            }
          ),
        },
      },
      {
        initialRouteName: signedIn ? 'App' : 'SignIn',
      }
    )
  );

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
