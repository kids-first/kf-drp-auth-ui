import React from 'react';
import { css } from 'glamor';

export default ({ children, className = '', style, ...props }) => (
  <div className={`${className} ${css({ position: 'relative' }, style)}`} {...props} {...props}>
    {children}
    <div className="rippleJS" />
  </div>
);
