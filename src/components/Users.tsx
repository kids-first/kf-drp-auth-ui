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
  list: {
    minWidth: 300,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    padding: '0 30px 20px',
    overflowY: 'auto',
    flex: 'none',
  },
  content: {},
};

const User = ({ item: { userName, email }, style, ...props }) => {
  return (
    <div style={{ padding: '20px 0', ...style }} {...props}>
      <div style={{ fontSize: 20, paddingBottom: 5 }}>{userName}</div>
      <div>{email}</div>
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
