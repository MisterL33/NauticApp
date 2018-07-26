import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image, ImageBackground, AsyncStorage } from 'react-native';
import Login from '../utils/login';
import Google from '../utils/google';
import { StackNavigator, NavigationAction } from 'react-navigation';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  LoginManager,
  AccessToken
} = FBSDK;



export default class LoginPage extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userGoogle: null
    }

  }


  componentDidMount() {


    // PARTIE CONNEXION FACEBOOK
    
    AccessToken.getCurrentAccessToken().then( // Récupération de l'user via le token donné par facebook lors du login
      (data) => {

        if (data) {
          this.props.navigation.navigate('Home') // si on a un token et donc des données, redirection vers la home
        } else {
          console.log('Not logged')
        }

      }
    );

    //PARTIE CONNEXION GOOGLE

    AsyncStorage.getItem('user')
      .then((user) => {
        if (user) {
          this.props.navigation.navigate('Home')
        }
      })

  }



  render() {

    return (
      <View>

        <ImageBackground
          source={require('../pics/home.jpg')}
          style={{ width: '100%', height: '100%' }}
        >




          <View style={styles.imageDiv}>

            <Image source={require('../pics/vague-02.png')} style={{ width: '100%', height: '55%' }} />
          </View>

          <View style={styles.logButton}>

            <Login nav={this.props.navigation} />

          </View>

          <View style={{ marginLeft: '18%', marginTop: '5%' }}>
            <Google nav={this.props.navigation} />
          </View>
        </ImageBackground>

      </View>
    )
  }

}


const styles = StyleSheet.create({


  logButton: {

    marginLeft: '25%',

  },

  titleDiv: {
    marginLeft: '40%'
  },

  titleText: {
    color: 'white'
  },

  imageDiv: {
    marginTop: '10%',
    width: '65%',
    height: '70%',
    marginLeft: '30%',


  }

});
