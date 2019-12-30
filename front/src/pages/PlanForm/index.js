import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdCheck } from 'react-icons/md';

import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '@rocketseat/unform';
import CurrencyInput from '~/components/MyCurrencyInput';
import { items } from '~/components/Header/menu';

import history from '~/services/history';

import { Container, Header, Data } from './styles';
import api from '~/services/api';

const schema = Yup.object().shape({
  title: Yup.string().required('* campo obrigatório'),
  duration: Yup.number()
    .typeError('* deve informar um número')
    .required('* campo obrigatório'),
  price: Yup.number()
    .typeError('* deve informar um número')
    .required('* campo obrigatório'),
});

export default function PlanForm() {
  const [plan, setPlan] = useState({});

  const { id } = useParams();

  useEffect(() => {
    async function loadPlan() {
      try {
        const { data } = await api.get('plans', {
          params: { id },
        });

        setPlan({ ...data, total_price: data.duration * data.price });
      } catch (err) {
        toast.error(err.response.data.error);
      }
    }

    // eslint-disable-next-line no-use-before-define
    if (!newPlan()) {
      loadPlan();
    }
  }, []); //eslint-disable-line

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function newPlan() {
    return !id;
  }

  async function handleSubmit(data) {
    try {
      if (!id) {
        await api.post('plans', data);
        toast.success('Plano cadastrado.');
      } else {
        await api.put(`plans/${plan.id}`, data);
        toast.success('Cadastro atualizado.');
      }
      history.push(items.plans.route);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  function handleDuration(newDuration) {
    setPlan({
      ...plan,
      duration: newDuration,
      total_price: plan.price * newDuration,
    });
  }

  function handlePrice(newPrice) {
    setPlan({
      ...plan,
      price: newPrice,
      total_price: plan.duration * newPrice,
    });
  }

  return (
    <Container>
      <Header>
        <strong>{newPlan() ? 'Cadastro de plano' : 'Edição de plano'}</strong>
        <div>
          <button type="button" onClick={() => history.push('/plans')}>
            <MdKeyboardArrowLeft color="#fff" size={16} />
            <span>VOLTAR</span>
          </button>

          <button type="submit" form="Form">
            <MdCheck color="#fff" size={16} />
            <span>SALVAR</span>
          </button>
        </div>
      </Header>

      <>
        <Data
          id="Form"
          schema={schema}
          onSubmit={handleSubmit}
          initialData={plan}
        >
          <strong>TÍTULO DO PLANO</strong>
          <Input name="title" />

          <div>
            <div>
              <strong>DURAÇÃO (em meses)</strong>
              <Input
                name="duration"
                type="number"
                onChange={e => handleDuration(e.target.value)}
              />
            </div>
            <div>
              <strong>PREÇO MENSAL</strong>
              <CurrencyInput name="price" prefix="R$ " onChange={handlePrice} />
            </div>
            <div>
              <strong>PREÇO TOTAL</strong>
              <CurrencyInput name="total_price" prefix="R$ " disabled />
            </div>
          </div>
        </Data>
      </>
    </Container>
  );
}
