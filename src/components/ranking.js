import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';


const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
    LoginManager,
    AccessToken
} = FBSDK;
import * as firebase from "firebase";

export default class Ranking extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props


        }
    }

    render(){
        return(
            <View><Text>Hello</Text></View>
        )
    }

}