import React from 'react';
import { Image } from 'react-native';

import logo from '~/assets/logoh.png';

import { Header } from './styles';

export default function AppHeader() {
  return (
    <Header>
      <Image source={logo} />
    </Header>
  );
}
