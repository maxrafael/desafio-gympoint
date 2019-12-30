import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  background: #fff;
  flex: 1;
`;

export const Content = styled.View`
  padding: 20px;
  background: #f2f2f2;
  height: 100%;
`;

export const Question = styled.View`
  padding: 20px;
  margin-top: 10px;
  margin-bottom: 50px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
`;

export const QuestionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const QuestionLabel = styled.Text`
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
`;

export const AnswerLabel = styled.Text`
  margin-top: 20px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
`;

export const QuestionDate = styled.Text`
  flex: 1;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  color: #666;
`;

export const QuestionContent = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 26px;
  color: #666;
`;

export const AnswerContent = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 26px;
  color: #666;
`;
