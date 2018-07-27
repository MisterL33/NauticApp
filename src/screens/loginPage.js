import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image, ImageBackground, AsyncStorage } from 'react-native';
import Login from '../utils/login';
import Google from '../utils/google';
import { StackNavigator, NavigationAction } from 'react-navigation';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { Header } from 'react-native-elements';
import ResponsiveImage from 'react-native-responsive-image';

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
          this.props.navigation.navigate('Home', { title: 'Carte des spots' }) // si on a un token et donc des données, redirection vers la home
        } else {
          console.log('Not logged')
        }

      }
    );

    //PARTIE CONNEXION GOOGLE

    AsyncStorage.getItem('user')
      .then((user) => {
        if (user) {
          this.props.navigation.navigate('Home', { title: 'Carte des spots' })
        }
      })

  }



  render() {

    return (


      <View>
        <Header
          
          centerComponent={{ text: 'Nautix, la communauté des riders', style: { color: '#fff', fontWeight: 'bold', fontSize: 20 } }}
          
          backgroundColor='#66ccff'


        />
        <ImageBackground
          source={require('../pics/home.jpg')}
          style={{ width: '100%', height: '100%' }}
        >


          <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', position: 'relative', top: '-50%' }}>
            <ResponsiveImage source={require('../pics/vague-02.png')} initWidth="138" initHeight="200" />
          </View>

          <View style={{ marginLeft: '25%', position: 'absolute', top: '60%' }}>

            <Login nav={this.props.navigation} />

          </View>

          <View style={{ marginLeft: '18%', position: 'absolute', top: '50%' }}>
            <Google nav={this.props.navigation} />
          </View>
        </ImageBackground>

      </View>
    )
  }

}


const styles = StyleSheet.create({




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
