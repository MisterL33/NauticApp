import { StyleSheet } from 'react-native';  


export default StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,

      
      alignItems: 'center',
      
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
