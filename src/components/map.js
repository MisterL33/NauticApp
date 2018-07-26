import React from 'react';
import { TouchableOpacity, Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';
import Geocoder from 'react-native-geocoder';
import windsurfIcon from '../pics/windsurf.png'
import kitesurfIcon from '../pics/kitesurf.png'
import myWindsurfIcon from '../pics/windsurfme.png';
import myKitesurfIcon from '../pics/kitesurfme.png';
import styles from '../styles/map.style';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';

const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
    LoginManager,
    AccessToken
} = FBSDK;
import * as firebase from "firebase";




export default class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: new Date(),
            address: 'Sanguinet',
            modalDateVisible: false

        }

    }


    componentDidMount() {

        const today = this.state.currentDate
        let day = today.getDate().toString()

        if (day.length !== 2) {
            day = '0' + day
        }

        const currentDate = today.getFullYear() + '-' + '0' + (today.getMonth() + 1) + '-' + day;
        this.setState({ currentDate: currentDate })

    }

    handleConfirmSearch = () => {
        console.log('confirm')
        console.log(this.state.address)
        fetch('https://maps.google.com/maps/api/geocode/json?address=' + this.state.address + '&key=AIzaSyBETNe1QHYEoXhx3-lhQWICKWm97syaOcA').then(
            (res) => this.setState({ object: JSON.parse(res._bodyText) }, () => {
                console.log(res);
                var object = this.state.object.results
                var results = []
                object.map((result) => results.push(result))   // ici on met toutes les locations trouvées, ce serait bien de les afficher pour choisir
                this.props.handleSetLatitude(results[0].geometry.location.lat)
                this.props.handleSetLongitude(results[0].geometry.location.lng)
            }
            ));

        this.props.handleModalVisible(false)

    }

    changeDate = (date) => {
        console.log(date)
        this.setState({ currentDate: date, modalDateVisible: false })
        
    }





    render() {
            
        if (this.state.currentDate) {
            console.log(this.state.currentDate)
            console.log(this.props.user)
            return (
                <View style={StyleSheet.absoluteFill}>

                    <View style={styles.container}>
                        <View style={{ height: '10%', zIndex: 80, flexDirection: 'row' }}>
                            <View style={{ width: '80%', height: '100%' }}>
                                <Hideo
                                    iconClass={FontAwesomeIcon}
                                    iconName={'search'}
                                    iconColor={'white'}
                                    // this is used as backgroundColor of icon container view.
                                    iconBackgroundColor={'#66ccff'}
                                    inputStyle={{ color: '#464949' }}
                                    onChangeText={(address) => this.setState({ address })} value={this.state.address}
                                    style={{ zIndex: 10 }}
                                />
                            </View>
                            <View style={{ width: '20%', height: '100%', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.button} onPress={this.handleConfirmSearch}>
                                    <Text style={styles.Go}  > Go </Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                        {/* 
                        <View style={{ width: '20%', height: '100%', zIndex: 80, alignItems: 'center', marginLeft: '1%', }}>
                            <TouchableOpacity style={styles.buttonDate} onPress={() => this.setState({modalDateVisible: true})}>
                                <Text style={styles.dateChange}> Changer date </Text>
                            </TouchableOpacity>
                        </View>
                        */}


{/* 

                        <Overlay visible={this.state.modalDateVisible}
                            closeOnTouchOutside animationType="zoomIn"
                            containerStyle={{ backgroundColor: 'rgba(37, 8, 10, 0.78)' }}
                            childrenWrapperStyle={{ backgroundColor: '#eee' }}
                            animationDuration={500}>
                            <Text style={styles.title}>Voir les sessions pour la date suivante : </Text>
                            
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
                                onDateChange={(date) => { this.changeDate(date) }}
   
                            />

                        </Overlay>

*/}
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
                                        description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo + ' -- ' + marker.marker.dateSessionMarker}
                                        key={i} />
                                    : marker.marker !== undefined && marker.marker.equipement === 'kite' && marker.marker.userId === this.props.user.id &&
                                    <MapView.Marker
                                        image={myKitesurfIcon}
                                        coordinate={{ latitude: marker.marker.latitudeMarker, longitude: marker.marker.longitudeMarker }}
                                        title={marker.marker.titleMarker}
                                        description={'De ' + marker.marker.hourSessionFrom + ' à ' + marker.marker.hourSessionTo + ' -- ' + marker.marker.dateSessionMarker}
                                        key={i}


                                    />
                            ))}

                            {this.props.otherMarkers.map((marker, i) => (
                                marker.marker !== undefined && marker.marker.equipement === 'wind' && marker.marker.userId !== this.props.user.id && marker.marker.dateSessionMarker === this.state.currentDate ?
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


                             <Button title='Disconnect' onPress={this.props.clearStorage}>Disconnect</Button>
                    </View>
                </View >
            )
        }
    }

}
