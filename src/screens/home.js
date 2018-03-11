
import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
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
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  LoginManager,
  AccessToken
} = FBSDK;
import * as firebase from "firebase";




const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 420,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '20%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'white',
    margin: '15',
    width: '30%',
    height: '30%',
    alignItems: undefined,
    justifyContent: undefined,

  }
});









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
      address: 'Sanguinet',
      equipement: 'wind',
      user: {

      },
      markers: [{}],
      otherMarkers: [{}],
 

    };
  }



  componentWillMount = () => {

    if (this.props.navigation.state.params) {

      this.setState({ user: this.props.navigation.state.params }, () => {
        //  console.log('navigation')
        //   console.log(this.state.user)
      })
    }
    else {
      AccessToken.getCurrentAccessToken().then((data) => {
        const { accessToken } = data
        this.RetrieveUserByActualToken(accessToken)

      })
    }
  }



  RetrieveUserByActualToken = async (token) => {

    const response = await fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
    const user = await response.json()
    const userId = user.id
    this.setState({ user })
    this.GetUserMarkers(userId)
  }




  GetUserMarkers = (userId) => {

    var userList = []
    var markerList = []
    var recentPostsRef = firebase.database().ref('/users');
    recentPostsRef.once('value').then(snapshot => {

      userList = snapshot.val()

      snapshot.forEach(user => {
        var userFormated = user.val();

        if (userFormated.facebookId === userId) 
        {
          console.log('utilisateur trouvé mamène')
          var markers = userFormated.markers
          Object.keys(markers).map((key) => {
            let marker = markers[key]
            markerList.push(marker)
          });

          this.setState({ markers: markerList })
        }

        else 
        {

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

  setModalVisible(visible) 
  {
    this.setState({ modalVisible: visible });
  }


  handleConfirmSearch = () => {

    fetch('https://maps.google.com/maps/api/geocode/json?address=' + this.state.address + '&key=AIzaSyBETNe1QHYEoXhx3-lhQWICKWm97syaOcA').then(
      (res) => this.setState({ object: JSON.parse(res._bodyText) }, () => {

        var object = this.state.object.results
        var results = []
        object.map((result) => results.push(result))   // ici on met toutes les locations trouvées, ce serait bien de les afficher pour choisir
        this.setState({ latitude: results[0].geometry.location.lat })
        this.setState({ longitude: results[0].geometry.location.lng })
      }
      ));

    this.setModalVisible(false)

  }


  mapPress = (e) => {

    // console.log(this.props.navigation.state.params)
    const today = new Date()

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

    const currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + '0' + today.getDate();

    this.setState({
      markerInfo: { // mise en state d'un nouvel objet markerInfo pour qu'il soit passé en props dans le child session
        latitudeMarker: e.nativeEvent.coordinate.latitude,
        longitudeMarker: e.nativeEvent.coordinate.longitude,
        dateCreationMarker: currentDate
      }
    }, () => {
      console.log('dans le mapPress')
      console.log(this.state.markerInfo)
    })

this.setModalVisible(true)

  }


  handleZoomOnMarker = (latitude, longitude) => {

    this.setState({ latitude: latitude })
    this.setState({ longitude: longitude })
    this.props.modalVisible(false)
  }


  handleUpdateMapMarkers = () => {

    this.GetUserMarkers(this.state.user.id)
    this.setModalVisible(false)
  }



  

  render() {
    console.log('render')


    if (this.state.user !== undefined) {
      const user = this.state.user
    }

    return (
      <View>
        <TextInput onChangeText={(address) => this.setState({ address })} value={this.state.address} />
        <Button title='Voir' onPress={this.handleConfirmSearch} />
        <View style={styles.container}>


        {this.state.user !== undefined && this.state.markers &&
          <Map {... this.state} handleUpdateMapMarkers={this.handleUpdateMapMarkers.bind(this)}
            mapPress={this.mapPress.bind(this)} handleModalVisible={this.setModalVisible.bind(this)} />
        }

          {this.state.user !== undefined && this.state.markerInfo && this.state.locality
            ? <Session {...this.state} user={this.state.user} handleUpdateMapMarkers={this.handleUpdateMapMarkers.bind(this)}
              markerInfo={this.state.markerInfo} locality={this.state.locality}
              handleZoomOnMarker={this.handleZoomOnMarker.bind(this)}
              handleModalVisible={this.setModalVisible.bind(this)}
            />
            : <Text>Nautix</Text>
          }


          <Button title='Classement' onPress={() => this.props.nav.navigate('Ranking')} />


        </View>
      </View>
    );
  }
}