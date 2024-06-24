import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';

const { TaskWidgetBridge } = NativeModules;

const IOSWidget = ({ tasks }) => {
  useEffect(() => {
    TaskWidgetBridge.updateWidget(tasks);
  }, [tasks]);

  return null;
};

export default IOSWidget;
