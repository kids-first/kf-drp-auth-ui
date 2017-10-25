import React from 'react';
import { css } from 'glamor';

const styles = {
  container: {
    minWidth: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
};
export default ({ type, className = '' }) => (
  <div className={`${className} ${css(styles.container)}`}>Please select a {type}</div>
);
