import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';
import Geocoder from 'react-native-geocoder';
import windsurfIcon from '../pics/windsurf.png'
import kitesurfIcon from '../pics/kitesurf.png'
import myWindsurfIcon from '../pics/windsurfme.png';
import myKitesurfIcon from '../pics/kitesurfme.png';

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

    }


    


    render() {
        console.log('render map')

        return (
            <MapView
                style={styles.map}
                showsMyLocationButton={true}
                onPress={this.props.mapPress.bind(this)}
                region={{
                    latitude: this.props.latitude,
                    longitude: this.props.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0922 + (400 / 800),
                }}
                annotations={this.props.markers}
                provider={PROVIDER_GOOGLE}
            >

                {this.props.markers.map((marker, i) => (
                    marker.marker !== undefined && marker.marker.equipement === 'wind' && marker.marker.userId === this.props.user.id ?
                        <MapView.Marker
                            image={myWindsurfIcon}
                            coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                            title={marker.marker.titleMarker}
                            description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo}
                            key={i} />
                        : marker.marker !== undefined && marker.marker.equipement === 'kite' && marker.marker.userId === this.props.user.id &&
                        <MapView.Marker
                            image={myKitesurfIcon}
                            coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                            title={marker.marker.titleMarker}
                            description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo}
                            key={i}


                        />
                ))}

                {this.props.markers.map((marker, i) => (
                    marker.marker !== undefined && marker.marker.equipement === 'wind' && marker.marker.userId !== this.props.user.id ?
                        <MapView.Marker
                            image={windsurfIcon}
                            coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                            title={marker.marker.titleMarker}
                            description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo}
                            key={i} />
                        : marker.marker !== undefined && marker.marker.equipement === 'kite' && marker.marker.userId !== this.props.user.id &&
                        <MapView.Marker
                            image={kitesurfIcon}
                            coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                            title={marker.marker.titleMarker}
                            description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo}
                            key={i}


                        />
                ))}
            </MapView>
          
        )
    }

}