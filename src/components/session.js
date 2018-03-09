import React from 'react';
import { Modal, Platform, StyleSheet, Text, View, Button, TouchableHighlight, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Overlay from 'react-native-modal-overlay';
import DatePicker from 'react-native-datepicker';


export default class Session extends React.Component{
    constructor(props){
        super(props);
    }

    



    render(){
        return(

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