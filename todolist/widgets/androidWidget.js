import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';

const { TaskWidgetBridge } = NativeModules;

const AndroidWidget = ({ tasks }) => {
  useEffect(() => {
    TaskWidgetBridge.updateWidget(tasks);
  }, [tasks]);

  return null;
};

export default AndroidWidget;
