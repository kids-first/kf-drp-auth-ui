import React from 'react';
import { css } from 'glamor';
import {
  getUsers,
  getUser,
  getGroups,
  addGroupToUser,
  removeGroupFromUser,
} from 'services';
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';

import Associator from 'components/ItemList/Associator';

import Item from './Item';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

export default class extends React.Component<any, any> {
  state = {
    currentUser: null,
    currentGroups: null,
  };

  fetchUser = async id => {
    const currentUser = await getUser(id);

    // TODO: objects should be returned in initial response, no need for this call
    const currentGroups = (await getGroups({
      limit: 100,
    })).resultSet.filter(r => currentUser.groups.find(name => name === r.name));

    this.setState({
      currentUser,
      currentGroups,
    });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchUser(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchUser(id);
    }
  }

  render() {
    const currentUser = this.state.currentUser as any;
    const currentGroups = this.state.currentGroups as any;

    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={Item}
          getKey={item => item.id}
          getData={getUsers}
          onSelect={user => {
            this.props.history.push(`/users/${user.id}`);
          }}
        />
        {currentUser && (
          <Content
            data={{
              ...currentUser,
              groups: (
                <Associator
                  key={`${currentUser.id}-groups`}
                  initialItems={currentGroups}
                  fetchItems={getGroups}
                  onAdd={group => {
                    addGroupToUser({ user: currentUser, group });
                  }}
                  onRemove={group => {
                    removeGroupFromUser({ user: currentUser, group });
                  }}
                />
              ),
            }}
            keys={[
              'firstName',
              'lastName',
              'userName',
              'email',
              'role',
              'status',
              'createdAt',
              'lastLogin',
              'preferredLanguage',
              'id',
              'groups',
            ]}
          />
        )}
      </div>
    );
  }
}
