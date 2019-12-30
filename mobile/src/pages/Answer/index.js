import React from 'react';
import PropTypes from 'prop-types';

import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  Container,
  Content,
  Question,
  QuestionLabel,
  QuestionDate,
  QuestionHeader,
  QuestionContent,
  AnswerLabel,
  AnswerContent,
} from './styles';

import AppHeader from '~/components/Header';

export default function Answer({ navigation }) {
  function formatDateRelative(date) {
    return formatRelative(parseISO(date), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }

  const question = navigation.getParam('item');

  return (
    <>
      <Container>
        <AppHeader />
        <Content>
          <Question>
            <QuestionHeader>
              <QuestionLabel>PERGUNTA</QuestionLabel>
              <QuestionDate>
                {formatDateRelative(question.created_at)}
              </QuestionDate>
            </QuestionHeader>
            <QuestionContent>{question.question}</QuestionContent>
            <AnswerLabel>RESPOSTA</AnswerLabel>
            <AnswerContent>{question.answer}</AnswerContent>
          </Question>
        </Content>
      </Container>
    </>
  );
}

Answer.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
