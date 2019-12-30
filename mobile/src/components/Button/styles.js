import { RectButton } from 'react-native-gesture-handler';

import styled from 'styled-components/native';

export const Container = styled(RectButton)`
  height: 46px;
  background: #ee4e62;
  border-radius: 4px;

  align-items: center;
  justify-content: center;

  opacity: ${props => (props.loading ? 0.7 : 1)};
`;

export const Text = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
