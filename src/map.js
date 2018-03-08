
import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';
import windsurfIcon from './pics/windsurf.png'
import kitesurfIcon from './pics/kitesurf.png'
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









export default class Map extends React.Component {

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
            markers: [
                {

                }
            ]
        };
    }



    componentWillMount = () => {
        if (this.props.nav.state.params) {

            this.setState({ user: this.props.nav.state.params }, () => {
                //  console.log('navigation')
                //  console.log(this.state.user)
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
        this.setState({ user }, () => {
            //      console.log('retrieve' + userId)
            //    console.log(this.state.user)


        })

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

                if (userFormated.facebookId === userId) {
                    console.log('utilisateur trouvé mamène')
                    var markers = userFormated.markers
                    Object.keys(markers).map((key) => {
                        let marker = markers[key]
                        markerList.push(marker)

                    });


                    this.setState({ markers: markerList }, () => {
                        //console.log('markerList')
                        //  console.log(this.state.markers)
                    })
                }

            })



        })


    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    modalCancel = () => {
        this.setModalVisible(false)
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

    }



    mapPress = (e) => {

        // console.log(this.props.navigation.state.params)
        const today = new Date()
        const currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + '0' + today.getDate();

        this.setState({ latitudeMarker: e.nativeEvent.coordinate.latitude, longitudeMarker: e.nativeEvent.coordinate.longitude, dateCreationMarker: currentDate })
        this.setModalVisible(true)

    }




    modalConfirm = () => {

        var marker = [...this.state.markers]
        var userList = []
        var recentPostsRef = firebase.database().ref('/users');
        var db = firebase.database();
        marker.push(
            {
                "latitudeMarker": this.state.latitudeMarker,
                "longitudeMarker": this.state.longitudeMarker,
                'titleMarker': this.state.titleMarker,
                'dateCreationMarker': this.state.dateCreationMarker,
                'dateSessionMarker': this.state.dateSessionMarker,
                'hourSessionFrom': this.state.hourSessionFrom,
                'hourSessionTo': this.state.hourSessionTo,
                'equipement': this.state.equipement
            })

        this.setState({ markers: marker })

        recentPostsRef.once('value').then(snapshot => { // get references de /user
            userList = snapshot.val()
            snapshot.forEach(user => { // boucle a travers les users en bases

                var userFormated = user.val();
                if (userFormated.facebookId === this.state.user.id) {
                        console.log('utilisateur trouvé mamène')

                    var newChild = user.ref.child('markers')
                    var markerFormated = {  // creation d'un marker pour l'user actuel
                        'dateCreationMarker': this.state.dateCreationMarker,
                        'titleMarker': userFormated.name + ' - ' + this.state.titleMarker,
                        'latitudeMarker': this.state.latitudeMarker,
                        'longitudeMarker': this.state.longitudeMarker,
                        'dateSessionMarker': this.state.dateSessionMarker,
                        'hourSessionFrom': this.state.hourSessionFrom,
                        'hourSessionTo': this.state.hourSessionTo,
                        'equipement': this.state.equipement

                    }

                    newChild.push(({ marker: markerFormated }))
                    this.GetUserMarkers(userFormated.facebookId)
                } else {
                       console.log('utilisateur non trouvé')
                }

            })
        })

        this.setModalVisible(false)


    }






    render() {
        console.log('render')
        console.log(this.state.markers)

        //var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANS ... ;
        return (
            <View>
                <TextInput onChangeText={(address) => this.setState({ address })} value={this.state.address} />
                <Button title='Voir' onPress={this.handleConfirmSearch} />
                <View style={styles.container}>

                    <MapView
                        style={styles.map}
                        showsMyLocationButton={true}
                        onPress={this.mapPress.bind(this)}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0922 + (400 / 800),
                        }}
                        annotations={this.state.markers}
                        provider={PROVIDER_GOOGLE}
                    >

                        {this.state.markers.map((marker, i) => (
                            marker.marker !== undefined && marker.marker.equipement === 'wind' ?
                            <MapView.Marker
                                image={windsurfIcon}
                                coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                                title={marker.marker.titleMarker}
                                description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo}
                                key={i} />
                            : marker.marker !== undefined && marker.marker.equipement === 'kite' &&
                            <MapView.Marker
                            image={kitesurfIcon}
                            coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                            title={marker.marker.titleMarker}
                            description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo}
                            key={i}
                            
                            
                        />
                        ))}
                    </MapView>











                    <Overlay visible={this.state.modalVisible}
                        closeOnTouchOutside animationType="zoomIn"
                        containerStyle={{ backgroundColor: 'rgba(37, 8, 10, 0.78)' }}
                        childrenWrapperStyle={{ backgroundColor: '#eee' }}
                        animationDuration={500}>
                        <Text>Créer une session ici ?</Text>

                        <Text> Description de la session : </Text>
                        <TextInput onChangeText={(titleMarker) => this.setState({ titleMarker })} value={this.state.titleMarker} />
                        <Text>Equipement pour la session </Text>
                        <Picker
                        style={{width: 200}}
                            selectedValue={this.state.equipement}
                            onValueChange={(itemValue, itemIndex) => this.setState({ equipement: itemValue }, () => console.log(this.state.equipement))}>
                            <Picker.Item label="Windsurf" value="wind" />
                            <Picker.Item label="Kitesurf" value="kite" />
                        </Picker>

                        <Text> Date de la session : </Text>
                        <DatePicker
                            style={{ width: 200 }}
                            date={this.state.dateSessionMarker}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate="2018-01-01"
                            maxDate="2018-12-12"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => { this.setState({ dateSessionMarker: date }) }}
                        />
                        <Text>Début de session : </Text>
                        <DatePicker
                            style={{ width: 200 }}
                            date={this.state.hourSessionFrom}
                            mode="time"
                            format="HH:mm"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            minuteInterval={10}
                            onDateChange={(hourSessionFrom) => { this.setState({ hourSessionFrom: hourSessionFrom }); }}
                        />

                        <Text> Fin de session </Text>
                        <DatePicker
                            style={{ width: 200 }}
                            date={this.state.hourSessionTo}
                            mode="time"
                            format="HH:mm"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            minuteInterval={10}
                            onDateChange={(hourSessionTo) => { this.setState({ hourSessionTo: hourSessionTo }); }}
                        />

                        <Button onPress={() => this.modalConfirm()} title='Ok' />
                        <Button onPress={() => this.modalCancel()} title='Annuler' />



                    </Overlay>
                </View>
            </View>
        );
    }
}