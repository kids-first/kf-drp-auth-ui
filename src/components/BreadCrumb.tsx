import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import Aux from 'components/Aux';
import { NavLink } from 'react-router-dom';

export default ({ path }) => (
  <Breadcrumb style={{ padding: 20, background: '#e7e7e7' }}>
    {path
      .split('/')
      .filter(Boolean)
      .map((crumb, i, arr) => {
        const isLast = i === arr.length - 1;

        return (
          <Aux key={crumb}>
            <Breadcrumb.Section active={isLast}>
              {isLast ? crumb : <NavLink to={`/${arr.slice(0, i + 1).join('/')}`}>{crumb}</NavLink>}
            </Breadcrumb.Section>
            {!isLast && <Breadcrumb.Divider />}
          </Aux>
        );
      })}
  </Breadcrumb>
);
