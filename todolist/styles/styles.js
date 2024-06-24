import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.select({ ios: 50, android: 30 }), 
    paddingHorizontal: 20,
    backgroundColor: Platform.select({ ios: '#ffe4e1', android: '#f0f8ff' }), 
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderBottomColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    borderBottomWidth: 2,
    padding: 10,
    flex: 1,
    marginRight: 10,
    color: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
  },
  addButton: {
    backgroundColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5, 
  },
  listItem: {
    padding: 15,
    backgroundColor: Platform.select({ ios: '#ffb6c1', android: '#87cefa' }), 
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  itemText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5, 
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  dialogTitle: {
    color: Platform.select({ ios: '#ff69b4', android: '#1e90ff' }), 
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dialogInput: {
    backgroundColor: '#f0f8ff',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
