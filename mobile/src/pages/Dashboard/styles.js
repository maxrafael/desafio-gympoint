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

export const SubmitButton = styled(Button)`
  margin-top: 5px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: 20px;
`;

export const Checkin = styled.View`
  height: 46px;
  padding: 0 20px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CheckNumber = styled.Text`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #444444;
`;

export const CheckDate = styled.Text`
  font-size: 14px;
  line-height: 16px;
  text-align: right;

  color: #666666;
`;
