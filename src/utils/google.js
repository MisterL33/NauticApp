import React from 'react';

import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import Home from '../screens/home';
import * as firebase from "firebase";
import { AsyncStorage } from "react-native"



export default class Google extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount = () => {

        // PARTIE CONNEXION GOOGLE
        GoogleSignin.hasPlayServices({ autoResolve: true })
            .then(() => {
                console.log('google ok')
            })
            .catch(err => {
                console.log('Play services error', err.code, err.message);
            });

        GoogleSignin.configure({

            webClientId: '384118391770-1g84f9rlc6o1jkgm2lpa21sjihtsdfdd.apps.googleusercontent.com', // only for iOS
        }).then(() => {
            // you can now call currentUserAsync()
        });
    }

    initUser = async (token) => {

        const user = await GoogleSignin.signIn();

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
            if (userList === null) {
                this.postData()
            } else {

                snapshot.forEach(user => {
                    var userFormated = user.val();

                    if (userFormated.googleId === actualUser.id) {
                        console.log('utilisateur trouvé')
                        exist = true
                        AsyncStorage.setItem('user', JSON.stringify(actualUser))
                        .then(() => {
                            this.props.nav.navigate('Home')
                        })
                    }
                })
                if (exist === false) {
                    this.postData() // si l'utilisateur n'existe pas en base, on appel la méthode d'insert     
                    console.log('utilisateur inséré')
                    this.props.nav.navigate('Home', { user: actualUser })
                }
            }
        })
    }

    postData = () => {
        var postData = {
            name: this.state.user.name,
            googleId: this.state.user.id,
        };
        var newPostKey = firebase.database().ref().child('users').push().key;
        var updates = {};

        updates['/users/' + newPostKey] = postData;
        firebase.database().ref().update(updates);

    }

    storeData = async () => {
        try {
            await AsyncStorage.setItem('user', 'lol');
            console.log('ok')
        } catch (error) {
            console.log(error)
        }
    }

    retrieveData = async () => {
        console.log('retrieve')
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                // We have data!!
                console.log(value)
            }
        } catch (error) {
            // Error retrieving data
        }
    }


    signIn = async () => { // fonction ouvrant le modal google
        try {
            this.initUser()
            this.setState({ logged: true })
        } catch (error) {
            if (error.code === 'CANCELED') {
                // user cancelled the login flow
            } else {
                console.log(error)
            }
        }
    };

    render() {


        return (

            <GoogleSigninButton
                style={{ width: 250, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this.signIn} />
        )
    }
}