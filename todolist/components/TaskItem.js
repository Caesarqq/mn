import React from 'react';
import { View, Text, Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../styles/styles';

function TaskItem({ item, completeTask, startEditTask, deleteTask, selectImage }) { 

  return (
    <View style={styles.listItem}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.itemText}>{item.value}</Text>
      <View style={styles.buttonContainer}>
        <IconButton
          icon={() => <MaterialCommunityIcons name="image" size={28} />}
          onPress={() => selectImage(item.key)}
          color="#ffffff"
          style={styles.iconButton}
        />
        <IconButton
          icon={() => <MaterialCommunityIcons name={item.completed ? "undo" : "check"} size={28} />}
          onPress={() => completeTask(item.key)}
          color="#ffffff"
          style={styles.iconButton}
        />
        <IconButton
          icon={() => <MaterialCommunityIcons name="pencil" size={28} />}
          onPress={() => startEditTask(item)}
          color="#ffffff"
          style={styles.iconButton}
        />
        <IconButton
          icon={() => <MaterialCommunityIcons name="delete" size={28} />}
          onPress={() => deleteTask(item.key)}
          color="#ffffff"
          style={styles.iconButton}
        />
      </View>
    </View>
  );
}

export default TaskItem;