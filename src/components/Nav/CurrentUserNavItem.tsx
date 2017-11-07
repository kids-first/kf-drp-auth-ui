import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'glamor';
import Gravatar from 'react-gravatar';
import { NavLink } from 'react-router-dom';
import onClickOutside from 'react-onclickoutside';

import Logout from 'components/Logout';
import colors from 'common/colors';

const enhance = compose(
  injectState,
  onClickOutside,
  withState('shouldShowMenu', 'setShouldShowMenu', false),
);

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontSize: 22,
    userSelect: 'none',
  },

  avatar: {
    borderRadius: '50%',
  },

  avatarContainer: {
    position: 'relative',
    overflow: 'hidden',

    '&::after': {
      position: 'absolute',
      borderRadius: '50%',
      border: `2px solid rgba(100, 100, 100, .1)`,
      boxSizing: 'border-box',
      content: '""',
      top: 2,
      left: 2,
      height: 42,
      width: 42,
    },
  },

  displayName: {
    marginLeft: 10,
    fontSize: 18,
  },

  userActions: {
    position: 'absolute',
    left: '100%',
    bottom: 0,
    width: '100%',
    boxShadow: '-2px 2px 2px 0 rgba(51, 7, 49, 0.24)',
    border: `1px solid ${colors.purple}`,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    overflow: 'hidden',
  },

  menuItem: {
    display: 'block',
    fontSize: 16,
    padding: '0.8em 1em',
    backgroundColor: '#790573',
    color: '#fff',
    '&:hover': {
      backgroundColor: colors.purple,
      color: '#fff',
    },
  },
};

const render = ({ state, style, shouldShowMenu, setShouldShowMenu }) => {
  return (
    state.loggedInUser && (
      <div className={`CurrentUserNavItem ${css(styles.container, style)}`}>
        <div className={`avatar-container ${css(styles.avatarContainer)}`}>
          <Gravatar
            className={`avatar ${css(styles.avatar)}`}
            email={state.loggedInUser.email}
            size={30}
          />
        </div>
        <div
          className={`display-name ${css(styles.displayName)}`}
          onClick={() => setShouldShowMenu(!shouldShowMenu)}
        >
          {state.loggedInUser.first_name}
        </div>
        {shouldShowMenu && (
          <div className={`user-actions ${css(styles.userActions)}`}>
            <NavLink
              to={`/users/${state.loggedInUser.id}`}
              className={`menu-item ${css(styles.menuItem)}`}
              onClick={() => setShouldShowMenu(false)}
            >
              Profile Page
            </NavLink>
            <Logout
              className={`menu-item Logout ${css(styles.menuItem)}`}
              onClick={() => setShouldShowMenu(false)}
            />
          </div>
        )}
      </div>
    )
  );
};

const Component = enhance(render);

Component.prototype.handleClickOutside = () => console.log('click');

export default Component;
