import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image, ImageBackground } from 'react-native';
import Login from '../login';
import { StackNavigator, NavigationAction } from 'react-navigation';
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
      user: null
    }

  }


  componentDidMount() {

    AccessToken.getCurrentAccessToken().then(
      (data) => {
        
        if(data){
          this.props.navigation.navigate('Home')
        }else{
          console.log('Not logged')
        }

      } //Refresh it every time
  );
  }


  render() {

    return (
      <View>
      
        <ImageBackground
          source={require('../pics/home.jpg')}
          style={{ width: '100%', height: '100%' }}
        >


        <View style={styles.titleDiv}>
          <Text style={styles.titleText}>Nautix</Text>

          </View>

          <View style={styles.imageDiv}>
            
          <Image source={require('../pics/vague-02.png')} style={{ width: '60%', height: '55%' }} />
            </View>
        
        <View style={styles.logButton}>

       <Login nav={this.props.navigation}  />
       
       
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

  imageDiv:{
    width: '60%',
    height: '60%',
    marginLeft: '30%',
    marginTop: '30%'

  }

});
