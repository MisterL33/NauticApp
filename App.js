/**

 * Sample React Native App

 * https://github.com/facebook/react-native

 * @flow

 */



import React, { Component } from 'react';

import {  Platform,  StyleSheet,  Text,  View} from 'react-native';

import { StackNavigator, NavigationAction } from 'react-navigation';

import RootStack from './src/router';




export default class App extends React.Component {

  render() {
  return (<RootStack/>);
  }

}
