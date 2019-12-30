import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0 15px;
  height: 46px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid #ddd;

  flex-direction: row;
  align-items: center;
`;

export const TInput = styled.TextInput.attrs({
  placeholderTextColor: 'rgba(196,196,196,1)',
})`
  flex: 1;
  font-size: 15px;
  margin-left: 10px;
  color: #c4c4c4;
`;
