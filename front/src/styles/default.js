import { darken } from 'polished';

const button = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  border: '0',
  fontWeight: 'bold',
  color: '#fff',
  fontSize: '16px',
  transition: 'background 0.2s',
};

const actionButton = {
  ...button,
  background: '#ee4d64',

  '&:hover': {
    background: darken(0.03, '#ee4d64'),
  },
};

const cancelButton = {
  ...button,
  background: '#cccccc',

  '&:hover': {
    background: darken(0.03, '#cccccc'),
  },
};

export { actionButton, cancelButton };
