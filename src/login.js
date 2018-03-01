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

import Home from './screens/home';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
    
       
    
      }

    initUser = async (token) => {
        
                    const response = await fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
        
                    const user = await response.json()
                    this.setState({ user }, () => {
                        this.getData()
                    });
        
                }
        
                getData = () => {
                    var userList = []
                    var recentPostsRef = firebase.database().ref('/users');
        
                    recentPostsRef.once('value').then(snapshot => {
                        userList = snapshot.val()
                        if(userList === null) {
                            this.postData()
                        } else {
                            const exist = Object.keys(userList).filter(user => user.facebookId === this.state.user.facebookId)
                            if (exist.length > 0) {
                                // ne rien faire
                            } else {
                                this.postData() // si l'utilisateur n'existe pas en base, on appel la méthode d'insert     
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
                                this.props.nav.navigate('Home')
                            })
                            
                        }
                    }
                }
                onLogoutFinished={() => alert('Logged out')} />


        )
    }
}