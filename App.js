import React from 'react';
import {Platform, StatusBar} from 'react-native';
import HomePage from './src/pages/HomePage/HomePage';

const App = () => {
  StatusBar.setBarStyle('light-content');
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }
  return (
    <>
      <HomePage />
    </>
  );
};

export default App;
