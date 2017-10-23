import React from 'react';
import { css } from 'glamor';
import { getGroups, getGroup, getUsers } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';
import { addGroupToUser, removeGroupFromUser } from '../services/updateUser';
import Associator from 'components/ItemList/Associator';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

const Group = ({ item: { name }, style, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        ...style,
      }}
      {...props}
    >
      <div style={{ fontSize: 20 }}>{name}</div>
    </div>
  );
};

export default class extends React.Component<any, any> {
  state = {
    currentGroup: null,
    currentUsers: null,
  };

  fetchGroup = async id => {
    const currentGroup = await getGroup(id);

    // TODO: objects should be returned in initial response, no need for this call
    const currentUsers = (await getUsers({
      limit: 100,
    })).resultSet.filter(user => {
      return user.groups.find(name => name === currentGroup.name);
    });

    this.setState({ currentGroup, currentUsers });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchGroup(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchGroup(id);
    }
  }

  render() {
    const currentGroup = this.state.currentGroup as any;
    const currentUsers = this.state.currentUsers as any;

    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={Group}
          getKey={item => item.id}
          getData={getGroups}
          onSelect={groups => this.props.history.push(`/groups/${groups.id}`)}
        />
        {currentGroup && (
          <Content
            data={{
              ...currentGroup,
              users: (
                <Associator
                  key={`${currentGroup.id}-groups`}
                  initialItems={currentUsers}
                  fetchItems={getUsers}
                  onAdd={user => {
                    addGroupToUser({ user, group: currentGroup });
                  }}
                  onRemove={user => {
                    removeGroupFromUser({ user, group: currentGroup });
                  }}
                />
              ),
            }}
            keys={[
              'name',
              'description',
              'id',
              'status',
              'applications',
              'users',
            ]}
          />
        )}
      </div>
    );
  }
}
