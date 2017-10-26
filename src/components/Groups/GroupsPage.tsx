import React from 'react';
import { css } from 'glamor';
import _ from 'lodash';
import { Route, matchPath } from 'react-router';
import {
  getGroups,
  getGroup,
  getUsers,
  getApps,
  addApplicationToGroup,
  removeApplicationFromGroup,
  getGroupApplications,
  getGroupUsers,
  addGroupToUser,
} from 'services';
import ListPane from 'components/ListPane';
import Content from 'components/Content';
import EmptyContent from 'components/EmptyContent';
import Associator from 'components/Associator/Associator';
import { removeGroupFromUser } from 'services/updateUser';
import GroupListItem from './ListItem';
import UserListItem from 'components/Users/ListItem';
import { AppListItem } from 'components/Apps';
import { NavLink } from 'react-router-dom';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
    '&:not(.bump-specificity)': {
      flexWrap: 'initial',
    },
  },
};

const resourceMap = {
  users: {
    name: 'users',
    ListItem: UserListItem,
    getData: getUsers,
    rowHeight: 50,
  },
  groups: {
    name: 'groups',
    ListItem: GroupListItem,
    getData: getGroups,
    rowHeight: 44,
  },
  apps: {
    name: 'apps',
    ListItem: AppListItem,
    getData: getApps,
    rowHeight: 30,
  },
};

export default class extends React.Component<any, any> {
  state = {
    currentGroup: null,
    currentUsers: null,
    currentApplications: null,
  };

  getSublistRouteMatch = () =>
    matchPath(this.props.location.pathname, {
      path: '/(users|groups|apps)/:id/(users|groups|apps)',
    });

  getShouldShowSublist = () => !!this.getSublistRouteMatch();

  getSubListResource = () => {
    const routeMatch = this.getSublistRouteMatch();
    if (!routeMatch) {
      return false;
    } else {
      return resourceMap[routeMatch.params[1]];
    }
  };

  fetchGroup = async id => {
    const [currentGroup, currentUsers, currentApplications] = await Promise.all([
      getGroup(id),
      getGroupUsers(id),
      getGroupApplications(id),
    ]);

    this.setState({
      currentGroup,
      currentUsers: currentUsers.resultSet,
      currentApplications: currentApplications.resultSet,
    });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchGroup(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id !== this.props.match.params.id) {
      if (id) {
        this.fetchGroup(id);
      } else {
        this.setState({
          currentGroup: null,
          currentUsers: null,
          currentApplications: null,
        });
      }
    }
  }

  render() {
    const currentGroup = this.state.currentGroup as any;
    const groupId = _.get(currentGroup, 'id');
    const { currentUsers, currentApplications } = this.state;

    const getShouldShowSublist = this.getShouldShowSublist();

    return (
      <div className={`row ${css(styles.container)}`}>
        {!getShouldShowSublist && (
          <ListPane
            Component={GroupListItem}
            getData={getGroups}
            selectedItem={currentGroup}
            rowHeight={44}
            onSelect={group => {
              if (group.id === groupId) {
                this.props.history.push('/groups');
              } else {
                this.props.history.push(`/groups/${group.id}`);
              }
            }}
          />
        )}
        {!currentGroup ? (
          <EmptyContent message="Please select a group" />
        ) : (
          <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
            {getShouldShowSublist && (
              <NavLink
                to={`/groups/${currentGroup.id}`}
                style={{ position: 'absolute', zIndex: 1 }}
              >
                (placeholder back button)
              </NavLink>
            )}
            <Content
              styles={getShouldShowSublist && { boxShadow: '0 0 12px 0 rgba(0,0,0,0.1)' }}
              data={{
                ...currentGroup,
                users: (
                  <div>
                    <Associator
                      key={`${currentGroup.id}-user`}
                      initialItems={currentUsers}
                      fetchItems={getUsers}
                      getName={user => `${user.lastName}, ${user.firstName[0]}`}
                      onAdd={user => {
                        addGroupToUser({ user, group: currentGroup });
                      }}
                      onRemove={user => {
                        removeGroupFromUser({ user, group: currentGroup });
                      }}
                    />
                    <NavLink to={`/groups/${currentGroup.id}/users`}>(placeholder link)</NavLink>
                  </div>
                ),
                applications: (
                  <div>
                    <Associator
                      key={`${currentGroup.id}-applications`}
                      initialItems={currentApplications}
                      fetchItems={getApps}
                      onAdd={application => {
                        addApplicationToGroup({ application, group: currentGroup });
                      }}
                      onRemove={application => {
                        removeApplicationFromGroup({
                          application,
                          group: currentGroup,
                        });
                      }}
                    />
                    <NavLink to={`/groups/${currentGroup.id}/apps`}>(placeholder link)</NavLink>
                  </div>
                ),
              }}
              keys={['name', 'description', 'id', 'status', 'users', 'applications']}
            />
          </div>
        )}
        <Route
          path="/groups/:id/users"
          render={() => {
            const resource = resourceMap.users;
            return (
              <ListPane
                Component={resource.ListItem}
                getData={resource.getData}
                rowHeight={resource.rowHeight}
              />
            );
          }}
        />
        <Route
          path="/groups/:id/apps"
          render={() => {
            const resource = resourceMap.apps;
            return (
              <ListPane
                Component={resource.ListItem}
                getData={resource.getData}
                rowHeight={resource.rowHeight}
              />
            );
          }}
        />
      </div>
    );
  }
}
