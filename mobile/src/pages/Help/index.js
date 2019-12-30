import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  Container,
  Content,
  SubmitButton,
  List,
  Question,
  QuestionHeader,
  QuestionStatus,
  QuestionDate,
  QuestionContent,
} from './styles';

import AppHeader from '~/components/Header';

import api from '~/services/api';

function Help({ navigation, isFocused }) {
  const student = useSelector(state => state.student.student);
  const [helpOrders, setHelpOrders] = useState([]);

  const [page, setPage] = useState(1);
  const [scroll, setScroll] = useState(false);
  const [showLoadingMoreIndicator, setShowLoadingMoreIndicator] = useState(
    false
  );
  const [noMoreData, setNoMoreData] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function loadHelpOrders(newPage) {
    const { data } = await api.get(
      `students/${student.id}/help-orders?page=${newPage}`
    );

    if (!data.rows.length) {
      if (newPage === 1) {
        setHelpOrders([]);
      }

      setNoMoreData(true);
    } else {
      setNoMoreData(false);

      if (newPage === 1) {
        setHelpOrders(data.rows);
      } else {
        const newHelpOrders = [...helpOrders, ...data.rows];
        setHelpOrders(newHelpOrders);
      }
    }

    setLoadingMore(false);
    setRefreshing(false);
    setShowLoadingMoreIndicator(false);

    setPage(newPage);
  }

  useEffect(() => {
    if (isFocused) {
      loadHelpOrders(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  async function handleLoadMore() {
    if (scroll) {
      setScroll(false);
      setLoadingMore(true);
      const newPage = page + 1;
      await loadHelpOrders(newPage);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    loadHelpOrders(1);
  }

  function renderFooter() {
    return (
      showLoadingMoreIndicator && (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator size={22} />
        </View>
      )
    );
  }

  function formatDateRelative(date) {
    return formatRelative(parseISO(date), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }

  return (
    <>
      <Container>
        <AppHeader />
        <Content>
          <SubmitButton onPress={() => navigation.navigate('Question')}>
            Novo pedido de auxílio
          </SubmitButton>
          <List
            data={helpOrders}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (!loadingMore && !refreshing) {
                handleLoadMore();
              }
            }}
            onMomentumScrollBegin={() => {
              setScroll(true);
              if (!noMoreData) {
                setShowLoadingMoreIndicator(true);
              }
            }}
            keyExtractor={(item, index) => String(index)}
            ListFooterComponent={renderFooter}
            renderItem={({ item }) => (
              <Question
                onPress={() => navigation.navigate('Answer', { item })}
                enabled={!!item.answer}
              >
                <QuestionHeader>
                  <Icon
                    name="check-circle"
                    color={item.answer ? '#42CB59' : '#999999'}
                    size={16}
                  />
                  <QuestionStatus answered={item.answer}>
                    {item.answer ? 'Respondido' : 'Sem resposta'}
                  </QuestionStatus>
                  <QuestionDate>
                    {formatDateRelative(item.created_at)}
                  </QuestionDate>
                </QuestionHeader>
                <QuestionContent>{item.question}</QuestionContent>
              </Question>
            )}
          />
        </Content>
      </Container>
    </>
  );
}

Help.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Help);
