
import React from 'react';
import { AsyncStorage, Modal, Platform, StyleSheet, Dimensions, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';
import windsurfIcon from '../pics/windsurf.png'
import kitesurfIcon from '../pics/kitesurf.png'
import myWindsurfIcon from '../pics/windsurfme.png';
import myKitesurfIcon from '../pics/kitesurfme.png';
import Session from '../components/session';
import Geocoder from 'react-native-geocoder';
import Ranking from '../components/ranking';
import Map from '../components/map';
import styles from '../styles/home.style';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  AccessToken
} = FBSDK;
import * as firebase from "firebase";


const { height: screenHeight, width: screenWidth } = Dimensions.get('window')


export default class Home extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      modalVisible: false,
      latitude: 44.837789,
      longitude: -0.57918,
      longitudeMarker: null,
      latitudeMarker: null,
      hourSessionFrom: '08:30',
      hourSessionTo: '12:30',
      address: '',
      equipement: 'wind',
      user: {

      },
      markers: [{}],
      otherMarkers: [{}],


    };
  }



  componentWillMount = () => {


    AccessToken.getCurrentAccessToken().then((data) => {
      if (data) {
        const { accessToken } = data
        this.RetrieveUserByActualToken(accessToken)
      }
    })

    AsyncStorage.getItem('user')
      .then((user) => {
        if (user) {
          
          let obj = JSON.parse(user);
          const userId = obj.id
          console.log('retrieve Google', obj.id)
          this.setState({ user: obj })
          this.GetUserMarkers(userId)
        }
      })

  }




  RetrieveUserByActualToken = async (token) => {

    const response = await fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
    const user = await response.json()
    const userId = user.id
    console.log('retrieve', userId)
    this.setState({ user })
    this.GetUserMarkers(userId)
  }






  GetUserMarkers = (userId) => {

    console.log('getMarkers')
    console.log(userId)

    var userList = []
    var markerList = []
    var recentPostsRef = firebase.database().ref('/users');
    recentPostsRef.once('value').then(snapshot => {


      snapshot.forEach(user => {
        var userFormated = user.val();
        //console.log(userFormated)
        if (userFormated.googleId === userId && userFormated.markers  || userFormated.facebookId === userId && userFormated.markers  ) {

          var markers = userFormated.markers
          Object.keys(markers).map((key) => {
            let marker = markers[key]
            markerList.push(marker)
          });

          this.setState({ markers: markerList }, () =>{
            //console.log(this.state.markers)
          })
        }


        if (userFormated.googleId !== userId && userFormated.markers || userFormated.facebookId !== userId) {

          var otherMarkers = userFormated.markers
          Object.keys(otherMarkers).map((key) => {
            let marker = otherMarkers[key]
            markerList.push(marker)

          });
          this.setState({ otherMarkers: markerList })
        }

      })
    })

  }

  // Fonctions permettant de set le state depuis un enfant
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }







  mapPress = (e) => {

    const today = new Date()
    let day = today.getDate().toString()
    let photoRef = null
    let placeObject = null
    let photoUrl = null
    //  console.log(e.nativeEvent)
    if (day.length !== 2) {
      day = '0' + day
    }

    var position = {
      lat: e.nativeEvent.coordinate.latitude,
      lng: e.nativeEvent.coordinate.longitude
    }

    Geocoder.geocodePosition(position).then(res => {
      res.map(geoObject => {
        if (geoObject.locality !== null) {
          this.setState({ locality: geoObject.locality })
        }
      })
    })
      .catch(err => console.log(err))

    const currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + day;
    this.setState({
      markerInfo: { // mise en state d'un nouvel objet markerInfo pour qu'il soit passé en props dans le child session
        latitudeMarker: e.nativeEvent.coordinate.latitude,
        longitudeMarker: e.nativeEvent.coordinate.longitude,
        dateCreationMarker: currentDate,
      }
    })

    this.setModalVisible(true)

  }


  handleZoomOnMarker = (latitude, longitude) => {

    this.setState({ latitude: latitude })
    this.setState({ longitude: longitude })
    this.setModalVisible(false)
  }


  handleUpdateMapMarkers = () => {

    this.GetUserMarkers(this.state.user.id)
    this.setModalVisible(false)
  }

  handleSetLatitude = (latitude) => {
    this.setState({ latitude: latitude }, () => {
      console.log(this.state.latitude)
    });

  }

  handleSetLongitude = (longitude) => {
    this.setState({ longitude: longitude }, () => {
      console.log(this.state.longitude)
    });

  }

  clearStorage = () => {

    AsyncStorage.clear()
   
  }



  // mettre les boutons search et classement sur le fichier map pour que la map soit le parent des boutons

  render() {



    if (this.state.user !== undefined) {
      const user = this.state.user
    }

    return (
      <View style={StyleSheet.absoluteFill}>


        <View style={styles.container}>


          {this.state.user !== undefined && this.state.markers &&
            <Map  {... this.state} handleUpdateMapMarkers={this.handleUpdateMapMarkers.bind(this)}
              mapPress={this.mapPress.bind(this)} handleModalVisible={this.setModalVisible.bind(this)}
              handleSetLatitude={this.handleSetLatitude.bind(this)} handleSetLongitude={this.handleSetLongitude.bind(this)}
              clearStorage={this.clearStorage.bind(this)}
            />
          }

          {this.state.user !== undefined && this.state.markerInfo && this.state.locality
            ? <Session {...this.state} user={this.state.user} handleUpdateMapMarkers={this.handleUpdateMapMarkers.bind(this)}
              markerInfo={this.state.markerInfo} locality={this.state.locality}
              handleZoomOnMarker={this.handleZoomOnMarker.bind(this)}
              handleModalVisible={this.setModalVisible.bind(this)}
            />
            : <Text></Text>
          }


        </View>
      </View>
    );
  }
}
