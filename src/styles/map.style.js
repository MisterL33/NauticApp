import { Dimensions, StyleSheet } from 'react-native'




export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,

        alignItems: 'center',
        
      },
    map: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        position:'absolute'
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
