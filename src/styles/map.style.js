import { Dimensions, StyleSheet } from 'react-native'


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,


    },
    map: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        position: 'absolute'
    },
    modal: {
        position: 'absolute',
        backgroundColor: 'white',
        margin: '15',
        width: '30%',
        height: '30%',
        alignItems: undefined,
        justifyContent: undefined,

    },
    button: {
        backgroundColor: '#66ccff',
        height: 50,  
        width: 100,
      
    },

    buttonGo: {
        backgroundColor: '#66ccff',
        height: 48,  
        width: 100,
        marginRight: '200%'
    },

    buttonDate: {
        
        backgroundColor: '#66ccff',
        height: 50,  
        width: '100%',
        borderRadius: 10

        
    },
    inputContainer: {
        borderLeftWidth: 2,
        borderLeftColor: '#66ccff',
        borderBottomWidth: 2,
        borderBottomColor: '#66ccff',
        borderRightColor: '#66ccff',
        borderTopWidth: 2,
        borderTopColor: '#66ccff',
        backgroundColor: 'rgba(255,255,255, 0.9)',
        marginTop: '1%',
        marginLeft: '1%',
        borderRadius: 10,
        zIndex: 10,
        borderRightWidth: 2,
        height: 60
    },
    searchBar: {
        marginLeft: '3%',
        marginBottom: '5%',
        color: 'white',
        width: 300,
        paddingLeft: 15,
        paddingRight: 15
    },
    Go: {
        color: 'white',
        marginTop: '4%',
        width: '100%',
        textAlign: 'center',
        marginTop: '20%'
    },
    dateChange: {
        color: 'white',
        textAlign: 'center',
        marginTop: '14%',
        
    },

    tips: {
        color: 'green',
        zIndex: 1000,
        left: '15%',
        position: 'absolute',
        top: height - 80,
        width: width
        
    },

    searchTitle: {
        textDecorationLine: 'underline',
        textAlign: 'center',
        color:'#66ccff'
    }
});
