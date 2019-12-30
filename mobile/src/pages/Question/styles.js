import styled from 'styled-components/native';

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

export const QuestionText = styled.TextInput.attrs({
  multiline: true,
})`
  padding: 20px;
  height: 300px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  line-height: 19px;
  font-size: 16px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 20px;
`;
