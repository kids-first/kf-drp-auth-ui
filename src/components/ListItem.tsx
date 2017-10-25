import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 0',
  },
  content: {
    position: 'relative',
    '&::before, &::after': {
      backgroundColor: colors.purple,
      content: '""',
      position: 'absolute',
      left: -10,
      height: '50%',
      width: 3,
      transition: 'opacity 0.15s, transform 0.3s',
      opacity: 0,
    },

    '&::before': {
      top: '0',
      transform: 'translateY(60%)',
    },
    '&::after': {
      top: '50%',
      transform: 'translateY(-60%)',
    },
  },
  selected: {
    '&::before, &::after': {
      transform: 'translateY(0) !important',
      opacity: 1,
    },
  },
};

export default ({ style, className, selected, children, ...props }: any) => {
  return (
    <div
      className={`ListItem ${className ? className : ''} ${css(styles.container, style)}`}
      {...props}
    >
      <div className={`${css(styles.content, selected && styles.selected)}`}>{children}</div>
    </div>
  );
};
