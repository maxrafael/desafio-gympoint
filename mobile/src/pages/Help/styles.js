import styled from 'styled-components/native';

import { RectButton } from 'react-native-gesture-handler';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  background: #fff;
  flex: 1;
`;

export const Content = styled.View`
  padding: 20px;
  background: #f2f2f2;
  height: 100%;
`;

export const SubmitButton = styled(Button)`
  margin-top: 5px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: 20px;
`;

export const Question = styled(RectButton)`
  padding: 20px;
  margin-top: 10px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #ddd;
  opacity: ${props => (props.enabled ? 1 : 0.6)};
`;

export const QuestionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const QuestionStatus = styled.Text`
  color: ${props => (props.answered ? '#42CB59' : '#999999')};
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  margin-left: 8px;
`;

export const QuestionDate = styled.Text`
  flex: 1;
  text-align: right;
  color: #666;
  font-size: 14px;
  line-height: 16px;
`;

export const QuestionContent = styled.Text.attrs({
  numberOfLines: 3,
})`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 26px;
  color: #666;
`;
