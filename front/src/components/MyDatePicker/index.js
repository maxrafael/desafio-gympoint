import React, { useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useField } from '@rocketseat/unform';
import DatePicker, { registerLocale } from 'react-datepicker';
import MaskedTextInput from 'react-text-mask';

import pt from 'date-fns/locale/pt';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt', pt);

export default function MyDatePicker({
  name,
  disabled,
  onValueChange,
  ...rest
}) {
  const ref = useRef();
  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [value, setValue] = useState();

  useMemo(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: fieldName,
        ref: ref.current,
        path: 'props.selected',
        defaultValue,
        clearValue: pickerRef => {
          pickerRef.clear();
        },
      });
    }
  }, [ref.current, fieldName]); //eslint-disable-line

  function handleStartDateChange(newDate) {
    setValue(newDate);
  }

  return (
    <>
      <DatePicker
        autoComplete="off"
        id={fieldName}
        name={fieldName}
        ref={ref}
        selected={value}
        onChange={newDate => {
          handleStartDateChange(newDate);
          if (onValueChange) onValueChange(newDate);
        }}
        dateFormat="dd/MM/yyyy"
        disabled={!!disabled}
        locale="pt"
        customInput={
          <MaskedTextInput
            type="text"
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
          />
        }
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      {error && <span>{error}</span>}
    </>
  );
}

MyDatePicker.defaultProps = {
  disabled: false,
  name: null,
  onValueChange: null,
};

MyDatePicker.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onValueChange: PropTypes.func,
};
