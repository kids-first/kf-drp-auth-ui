import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import Aux from 'components/Aux';
import { NavLink } from 'react-router-dom';
import { css } from 'glamor';

export default ({ path }) => (
  <Breadcrumb
    style={{ padding: '10px 20px', background: 'rgb(33, 133, 208)', textTransform: 'capitalize' }}
  >
    {path
      .split('/')
      .filter(Boolean)
      .map((crumb, i, arr) => {
        const isLast = i === arr.length - 1;

        return (
          <Aux key={crumb}>
            <Breadcrumb.Section active={isLast}>
              {isLast ? (
                <span className={`${css({ color: '#eaf3f9 !important', fontWeight: 400 })}`}>
                  {crumb}
                </span>
              ) : (
                <NavLink
                  className={css({ color: '#fff !important', opacity: 0.8 })}
                  to={`/${arr.slice(0, i + 1).join('/')}`}
                >
                  {crumb}
                </NavLink>
              )}
            </Breadcrumb.Section>
            {!isLast && (
              <Breadcrumb.Divider
                style={{ margin: '0px 0.4em 0 0.5em' }}
                className={`${css({ color: '#fff !important' })}`}
              />
            )}
          </Aux>
        );
      })}
  </Breadcrumb>
);
