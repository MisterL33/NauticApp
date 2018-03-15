import React, { Component } from 'react';
import { StackNavigator, NavigationAction } from 'react-navigation';
const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  LoginManager,
  AccessToken
} = FBSDK;

import * as firebase from "firebase";

firebase.initializeApp({
    
      apiKey: "AIzaSyDYMR5mJnwLg4gDWJh4TLrhjcPP-2ScnyU",
    
      authDomain: "nauticapp-b4512.firebaseapp.com",
    
      databaseURL: "https://nauticapp-b4512.firebaseio.com",
    
      storageBucket: "nauticapp-b4512.appspot.com"
    
    });

import Home from '../screens/home';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
    
       
    
      }

    initUser = async (token) => {
        
                    const response = await fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
        
                    const user = await response.json()
                    this.setState({ user }, () => {
                      
                        this.getData(this.state.user)
                       
                    });
        
                }
        
                getData = (actualUser) => {
                    var userList = []
                    var recentPostsRef = firebase.database().ref('/users');
                    var exist = false;
                    recentPostsRef.once('value').then(snapshot => {
                        userList = snapshot.val()
                        if(userList === null) {
                            this.postData()
                        } else {

                            snapshot.forEach(user => {
                                var userFormated = user.val();

                                if(userFormated.facebookId === actualUser.id){


                                console.log('utilisateur trouvé')
                                exist = true
                                this.props.nav.navigate('Home', {user: actualUser})
                                
                            } 
                            })
                            if(exist === false) {
                                this.postData() // si l'utilisateur n'existe pas en base, on appel la méthode d'insert     
                                console.log('utilisateur inséré')
                                this.props.nav.navigate('Home', {user: actualUser})
                            }
                        }

        
                    })
        
                }
        
                postData = () => {
                    var postData = {
                        name: this.state.user.name,
                        facebookId: this.state.user.id,
                    };
                    var newPostKey = firebase.database().ref().child('users').push().key;
                    var updates = {};
        
        
        
                    updates['/users/' + newPostKey] = postData;
        
                    firebase.database().ref().update(updates);
        
                }

    render() {
        
        
        return (

            <LoginButton
                publishPermissions={["publish_actions"]}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            alert("Login failed with error: " + result.error);
                        } else if (result.isCancelled) {
                            alert("Login was cancelled");
                        } else {
                            AccessToken.getCurrentAccessToken().then((data) => {
                                const { accessToken } = data
                                this.initUser(accessToken)
                                this.setState({logged: true})
                               
                                
                            })
                            
                        }
                    }
                }
                onLogoutFinished={() => alert('Logged out')} />


        )
    }
}