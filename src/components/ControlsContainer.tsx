import React from 'react';
import { css } from 'glamor';

const paneControls = {
  container: {
    backgroundColor: 'rgba(144, 144, 144, 0.05)',
    borderBottom: '1px solid #eaeaea',
    padding: '20px 24px',
    display: 'flex',
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
};

export default ({ children, style, className = '', ...props }: any) => {
  return (
    <div className={`${className} pane-controls ${css(paneControls.container, style)}`} {...props}>
      {children}
    </div>
  );
};
