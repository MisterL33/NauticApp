import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';


const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
    LoginManager,
    AccessToken
} = FBSDK;
import * as firebase from "firebase";

export default class Session extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props


        }
    }

    componentWillReceiveProps() {
        console.log('Will receive props')
     //   console.log(this.props.user)
        if(this.props.user && this.props.userMarkers && this.props.otherMarkers){
            this.setState({user: this.props.user,  markers: this.props.userMarkers, otherMarkers: this.props.otherMarkers})
           
        }
        
        
        this.setState({ modalVisible: this.props.modalVisible })
    }

    componentDidMount=()=>{
       
    }


    modalCancel = () => {

        this.props.handleModalVisible(false)

    }



    modalConfirm = () => {
        console.log('modalConfirm')
                console.log(this.props)
                var marker = [...this.state.markers]
                var userList = []
                var recentPostsRef = firebase.database().ref('/users');
                var db = firebase.database();
                marker.push(
                    {
                        "latitudeMarker": this.props.markerInfo.latitudeMarker,
                        "longitudeMarker": this.props.markerInfo.longitudeMarker,
                        'titleMarker': this.state.titleMarker,
                        'dateCreationMarker': this.props.markerInfo.dateCreationMarker,
                        'dateSessionMarker': this.state.dateSessionMarker,
                        'hourSessionFrom': this.state.hourSessionFrom,
                        'hourSessionTo': this.state.hourSessionTo,
                        'equipement': this.state.equipement,
                        'userId': this.state.user.id,
                        'locality': this.props.locality
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
                                'dateCreationMarker': this.props.markerInfo.dateCreationMarker,
                                'titleMarker': userFormated.name + ' - ' + this.state.titleMarker,
                                'latitudeMarker': this.props.markerInfo.latitudeMarker,
                                'longitudeMarker': this.props.markerInfo.longitudeMarker,
                                'dateSessionMarker': this.state.dateSessionMarker,
                                'hourSessionFrom': this.state.hourSessionFrom,
                                'hourSessionTo': this.state.hourSessionTo,
                                'equipement': this.state.equipement,
                                'userId': this.state.user.id,
                                'locality': this.props.locality
        
                            }
                            
                            newChild.push(({ marker: markerFormated }))
                       
                                this.props.handleUpdateMapMarkers()
                                this.props.handleZoomOnMarker(this.props.markerInfo.latitudeMarker, this.props.markerInfo.longitudeMarker)
                          
                        } else {
                            console.log('utilisateur non trouvé')
                        }
                        
                    })
                })
        
                this.props.handleModalVisible(false)
                
        
            }
    


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }


    render() {
        console.log('render session')
    //    console.log(this.state)

        return (

            <Overlay visible={this.props.modalVisible}
                closeOnTouchOutside animationType="zoomIn"
                containerStyle={{ backgroundColor: 'rgba(37, 8, 10, 0.78)' }}
                childrenWrapperStyle={{ backgroundColor: '#eee' }}
                animationDuration={500}>
                <Text>Créer une session ici ?</Text>

                <Text> Description de la session : </Text>
                <TextInput onChangeText={(titleMarker) => this.setState({ titleMarker })} value={this.props.titleMarker} />
                <Text>Equipement pour la session </Text>
                <Picker
                    style={{ width: 200 }}
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
        )
    }
    

}