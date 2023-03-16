import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  page: {
    padding: 16,
    marginTop: 150,
  },
  text: {
    color: 'lightgrey',
  },
  headerFooterContainer: {
    marginVertical: 10,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: '#661538',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 20,
    borderColor: '#661538',
    borderWidth: 2,
  },
});

export default styles;