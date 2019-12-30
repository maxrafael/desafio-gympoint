import React, { useState } from 'react';
import { Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import logo from '~/assets/logo.png';

import { Container, Form, FormInput, SubmitButton } from './styles';
import { signInRequest } from '~/store/modules/auth/actions';

export default function SignIn() {
  const dispatch = useDispatch();

  const [id, setId] = useState();

  const loading = useSelector(state => state.auth.loading);

  function handleSubmit() {
    if (!id) {
      Alert.alert('Aviso', 'Informe seu ID para entrar');
      return;
    }

    dispatch(signInRequest(id));
  }

  return (
    <>
      <Container>
        <Image source={logo} />

        <Form>
          <FormInput
            placeholder="Informe seu ID de cadastro"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={id}
            onChangeText={setId}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Entrar no sistema
          </SubmitButton>
        </Form>
      </Container>
    </>
  );
}
