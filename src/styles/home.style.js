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

  },

  button: {
    backgroundColor: '#66ccff',
    height: 50,
    width: 100,

  },

  Ok: {
    color: 'white',
    marginTop: '4%',
    width: '100%',
    textAlign: 'center',
    marginTop: '20%'
  },

  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
});
