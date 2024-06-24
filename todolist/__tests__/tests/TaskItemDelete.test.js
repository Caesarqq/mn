import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../../components/TaskItem';
import '@testing-library/jest-native/extend-expect';
// Создаем фиктивную задачу для тестирования
const task = {
  key: '1',
  value: 'Test Task',
  completed: false,
  image: null,
};
test('calls deleteTask when delete icon is pressed', () => {
  // Мокаем функции для передачи в компонент
  const completeTask = jest.fn();
  const startEditTask = jest.fn();
  const deleteTask = jest.fn();
  const selectImage = jest.fn();
  // Рендерим компонент TaskItem с фиктивной задачей и мок-функциями
  const { getByTestId } = render(
    <TaskItem
      item={task}
      completeTask={completeTask}
      startEditTask={startEditTask}
      deleteTask={deleteTask}
      selectImage={selectImage}
    />
  );
  // Симулируем нажатие на кнопку удаления задачи
  fireEvent.press(getByTestId('delete-task-button'));

  // Проверяем, что функция deleteTask была вызвана с правильным аргументом
  expect(deleteTask).toHaveBeenCalledWith('1');
});
