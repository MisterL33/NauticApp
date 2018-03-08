
import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  AccessToken
} = FBSDK;

  
import Map from '../map';






export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);



  }

  componentDidMount = () => {

  }


  render() {
    return (
      <View>
        <Map nav={this.props.navigation} />
      </View>
    )
  }




}

