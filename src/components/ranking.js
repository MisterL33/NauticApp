import React from 'react';
import { ActivityIndicator, Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker, AppRegistry } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/ranking.style';
import Carousel from 'react-native-carousel-view';
import RNFetchBlob from 'react-native-fetch-blob'
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
    LoginManager,
    AccessToken
} = FBSDK;
import * as firebase from "firebase";
import { Image } from 'react-native-animatable';



export default class Ranking extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            localityArray: [],
            localityObject: [{
                name: null,
                count: null,
            }],
            placeObjectWithRef: [{}]


        }
    }


    componentDidMount = () => {
        console.log('mount ranking')
        const today = new Date()
        let day = today.getDate().toString()
        if (day.length !== 2) {
            day = '0' + day
        }
        const currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + day;

        const recentPostsRef = firebase.database().ref('/users');
        var localityObject = {}
        let localityArray = [];
        let localityTemp = null
        let markerCount = 1
        let i = 0
        recentPostsRef.once('value').then(snapshot => {
            snapshot.forEach(user => {
                let userFormated = user.val();
                let markers = userFormated.markers;


                Object.keys(markers).map((key) => {

                    let marker = markers[key]
                    if (marker.marker.dateSessionMarker === currentDate) {

                        if (localityObject.hasOwnProperty(marker.marker.locality)) {

                            localityObject[marker.marker.locality] = localityObject[marker.marker.locality] + 1

                        }

                        else {
                            localityTemp = marker.marker.locality
                            localityObject[localityTemp] = 1

                        }

                    }
                })
            });

            let pairs = Object.keys(localityObject).map(function (key) {
                return [key, localityObject[key]];
            });

            pairs.sort(function (a, b) {
                return a[1] - b[1];
            });
            let result = pairs.slice(-3)
            console.log(result)
            let resultObject = []

            result.map(res => {
                let populator = {}
                populator.count = res[1]
                populator.name = res[0]
                populator.photoUrl = null

                resultObject.push(populator)
            })



            this.getPhotosForPlaces(resultObject)
        })



    }

    getPhotosForPlaces = (places) => {

        let placeObjWithRef = []
        Object.keys(places).map(key => {
       
            setTimeout(function () {
                fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + places[key].name + '&key=AIzaSyBDNk4XSccyK_KFVML352LLYXnI3Tp7S6c').then(
                    (res) => {

                        placeObject = JSON.parse(res._bodyText)
                        console.log(placeObject)
                        if(placeObject.results[0].photos){
                            places[key].photoUrl = placeObject.results[0].photos[0].photo_reference
                        }
                        else{
                            console.log('nophotos')
                            places[key].photoUrl = null
                        }
                        
                        placeObjWithRef.push(places[key])

                        this.setState({ placeObjectWithRef: placeObjWithRef })

                    }

                )
            }.bind(this), 3000);
        })





    }



    render() {
        console.log('render ranking')

        if(this.state.placeObjectWithRef.length === 3){
            this.state.placeObjectWithRef.map(key => {
                console.log(key.photoUrl)
            })
        
      

        return (
            <View style={{width: '100%', height: '100%', alignItems: 'center', marginTop:'10%'}}>
              
                {this.state.placeObjectWithRef.map((key, i) => (
                    <View key={i} style={{width: '100%', height: '30%', alignItems: 'center'}}>
                        <Text>{key.name} - {key.count} Pratiquants</Text>
                        {key.photoUrl === null ?
                        <Image style={{ width: '50%', height: '80%' }} source={require('../pics/404.png')} /> :
                        <Image style={{ width: '50%', height: '80%' }} source={{ uri: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+ key.photoUrl +'&key=AIzaSyDYMR5mJnwLg4gDWJh4TLrhjcPP-2ScnyU' }} />
                }
                        </View>
                 ) )}

            </View>
        )
    } else{
        return(
            <View style={{marginTop:'65%'}}>
               <ActivityIndicator size="large" color="#0000ff" />
                    </View>
        )
    }
    }



}