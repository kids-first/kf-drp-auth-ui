import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import DisplayName from './DisplayName';
import ListItem from 'components/ListItem';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
    '& .DisplayName, & .email': {
      position: 'relative',
    },
  },
  email: {
    color: '#aaa',
    fontWeight: 200,
    fontSize: '0.9em',
  },
  userAdmin: {
    marginLeft: 5,
    fontSize: '0.5em',
    color: colors.purple,
  },
};

export default ({ item: { firstName, lastName, email, status, role }, style, ...props }) => {
  return (
    <ListItem
      style={
        status === 'Deactivated'
          ? {
              opacity: 0.3,
              fontStyle: 'italic',
              ...style,
            }
          : style
      }
      {...props}
    >
      <DisplayName firstName={firstName} lastName={lastName} role={role} />
      <span className={`email ${css(styles.email)}`}>{email}</span>
    </ListItem>
  );
};
