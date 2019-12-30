import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';

import { Container, Content, QuestionText, SubmitButton } from './styles';

import AppHeader from '~/components/Header';

import api from '~/services/api';

export default function Question({ navigation }) {
  const [question, setQuestion] = useState('');

  const student = useSelector(state => state.student.student);

  async function handleSubmit() {
    try {
      await api.post(`/students/${student.id}/help-orders`, { question });
      Alert.alert('', 'Seu pedido foi enviado com sucesso', [
        {
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.response.data.error);
    }
  }

  return (
    <>
      <Container>
        <AppHeader />
        <Content>
          <QuestionText
            placeholder="Inclua seu pedido de auxílio"
            value={question}
            onChangeText={setQuestion}
          />
          <SubmitButton onPress={handleSubmit}>Enviar pedido</SubmitButton>
        </Content>
      </Container>
    </>
  );
}

Question.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
