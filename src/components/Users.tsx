import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import { getUsers } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
  content: {},
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '15px 0',
  },
  userName: {
    width: '16em',
    fontSize: 20,
    paddingBottom: 5,
    display: 'flex',
    alignItems: 'baseline',
    wordBreak: 'break-all',
  },
};

const User = ({
  item: { firstName, lastName, email, status, role },
  style,
  className,
  ...props,
}) => {
  return (
    <div
      className={`${className ? className : ''} ${css({
        ...styles.userContainer,
        opacity: status === 'Deactivated' ? 0.5 : 1,
        ...style,
      })}`}
      {...props}
    >
      <div className={`${css(styles.userName)}`}>
        <div>
          {firstName} {lastName}
        </div>
        {role === 'ADMIN' && (
          <div
            style={{ marginLeft: 5, fontSize: '0.5em', color: colors.purple }}
          >
            ADMIN
          </div>
        )}
      </div>
      {email}
    </div>
  );
};

const Content = ({ data }) => {
  return <div className={`${css(styles.content)}`}>{JSON.stringify(data)}</div>;
};

export default class extends React.Component {
  state = {
    currentUser: null,
  };

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={User}
          getKey={item => item.id}
          getData={getUsers}
          onSelect={currentUser => this.setState({ currentUser })}
        />
        {this.state.currentUser && <Content data={this.state.currentUser} />}
      </div>
    );
  }
}
