
import React from 'react';
import { AsyncStorage, TouchableOpacity, Platform, StyleSheet, Dimensions, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
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
import { PermissionsAndroid } from 'react-native';
import Modal from "react-native-modal";
import ResponsiveImage from 'react-native-responsive-image';
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
      isModalVisible: this.props.navigation.state.params.modalOpen,
      latitude: 44.8404400,
      longitude: -0.5805000,
      longitudeMarker: null,
      latitudeMarker: null,
      hourSessionFrom: '08:30',
      hourSessionTo: '12:30',
      address: '',
      equipement: 'wind',
      currentTitle: 'Carte des spots',
      user: {

      },
      markers: [{}],
      otherMarkers: [{}],


    };
  }




  componentWillMount = () => {
    console.log('here bro')
    console.log(this.props.navigation)
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
          //console.log('retrieve Google', obj.id)
          this.setState({ user: obj })
          this.GetUserMarkers(userId)
        }
      })
    {/*
      navigator.geolocation.getCurrentPosition((position) => {
          
        this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude})
      
      })
       */}
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
        if (userFormated.googleId === userId && userFormated.markers || userFormated.facebookId === userId && userFormated.markers) {

          var markers = userFormated.markers
          Object.keys(markers).map((key) => {
            let marker = markers[key]
            markerList.push(marker)
          });

          this.setState({ markers: markerList }, () => {
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

  setCurrentDate(date) {
    this.setState({ currentDate: date })
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

    AsyncStorage.clear() // a retirer avant mise en prod
    this.props.navigation.goBack()

  }
  toggleModalWelcome = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }


  // mettre les boutons search et classement sur le fichier map pour que la map soit le parent des boutons

  render() {



    if (this.state.user !== undefined) {
      const user = this.state.user
    }

    return (
      <View style={StyleSheet.absoluteFill}>

     
        <TouchableOpacity onPress={this.toggleModalWelcome}>
          <Text>Show Modal</Text>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalContent}>
            <Text>Bienvenue sur Nautix ! {"\n"} {"\n"}
              Cette carte permet de prévoir des sessions sur vos spot favoris : pour créer une session il suffit d'appuyer longuement sur la zone de votre choix !{"\n"} {"\n"} 

              De base vous voyez les sessions des autres pratiquants pour la journée actuelle mais vous pouvez aussi changer la date pour voir le reste.{"\n"} {"\n"}

              L'application vient d'être lancée et est encore en phase de test, si vous rencontrez un bug n'hesitez pas à le signaler.{"\n"} {"\n"}

              Tips : vous voyez toutes vos sessions peu importe la date.{"\n"}{"\n"}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.toggleModalWelcome}>
              <Text style={styles.Ok} >Ok !</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    
       

        {this.state.user !== undefined && this.state.markers &&
          <Map  {... this.state} handleUpdateMapMarkers={this.handleUpdateMapMarkers.bind(this)}
            mapPress={this.mapPress.bind(this)} handleModalVisible={this.setModalVisible.bind(this)}
            handleSetLatitude={this.handleSetLatitude.bind(this)} handleSetLongitude={this.handleSetLongitude.bind(this)}
            clearStorage={this.clearStorage.bind(this)} nav={this.props.navigation} setCurrentDate={this.setCurrentDate.bind(this)}
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
      
    );
  }
}
