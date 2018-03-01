
import React from 'react';
import {  Platform,  StyleSheet,  Text,  View, Button, TouchableHighlight, TextInput} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


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
});


export default class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = { 
      
      latitude: 44.837789,
      longitude: -0.57918,
      address: 'Sanguinet'
    };
  }


componentDidMount(){
  console.log('test')
}

handleConfirmSearch = () => {
  console.log('ok')
 fetch('https://maps.google.com/maps/api/geocode/json?address='+this.state.address+'&key=AIzaSyBETNe1QHYEoXhx3-lhQWICKWm97syaOcA').then(
   (res) => this.setState({object: JSON.parse(res._bodyText)}, () => {
   
     var object = this.state.object.results
     var results = []
     object.map((result) => results.push(result))   // ici on met toutes les locations trouvées, ce serait bien de les afficher pour choisir
     this.setState({latitude: results[0].geometry.location.lat})
     this.setState({longitude: results[0].geometry.location.lng})
   }
  
  ));



}

  render() {
    const{ navigate } = this.props.navigation
    const longitude = 0.0922 + (400/800)
    var markers = [
      {
        latitude: 44.837789,
        longitude: -0.57918,
        title: 'Test',
        subtitle: '1234 Foo Drive'
      }
    ];
    return (
  
  <View>
<TextInput onChangeText={(address) => this.setState({address})} value={this.state.address} />
<Button title='Voir' onPress={this.handleConfirmSearch}/>   

<View style ={styles.container}>
       
        <MapView 
          style={styles.map}
          showsMyLocationButton={true}
          
          region={{
            latitude: this.state.latitude, 
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: longitude,
          }}
          annotations={markers}
           provider={PROVIDER_GOOGLE}
        >
         <MapView.Marker
      coordinate={{longitude: 44.837789, latitude: -0.57918}}
      title={'Test'}
      description={'1234 Foo Drive'}>
      <View style={styles.bikeRadius}>
        <View style={styles.bikeMarker}></View>
      </View>
    </MapView.Marker>

        </MapView>
        
    </View>
    </View>
    );
  }
}

