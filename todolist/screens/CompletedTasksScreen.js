import React, { useState } from 'react';
import { Text, View, FlatList, Image, Platform, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles/styles';

function CompletedTasksScreen() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Ошибка при загрузке задач', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Ошибка при загрузке задач", ToastAndroid.LONG);
      } else {
        Alert.alert("Ошибка", "Ошибка при загрузке задач");
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}></Text>
      <FlatList
        data={tasks.filter(task => task.completed)}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
            <Text style={styles.itemText}>{item.value}</Text>
          </View>
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

export default CompletedTasksScreen;
