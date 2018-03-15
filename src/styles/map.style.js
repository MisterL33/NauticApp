import { StyleSheet } from 'react-native';  


export default StyleSheet.create({
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