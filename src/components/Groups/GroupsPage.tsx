import React from 'react';
import { css } from 'glamor';
import _ from 'lodash';
import { Route, matchPath } from 'react-router';
import TransitionGroup from 'react-transition-group-plus';
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
    // width: '100%',
    flexWrap: 'initial',
    '&:not(.bump-specificity)': {
      flexWrap: 'initial',
    },
    overflow: 'hidden',
  },
  screen: {
    display: 'flex',

    flexShrink: 0,
    flexBasis: '100%',
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

interface GroupDetailsProps {
  group?: any;
  groupUsers?: any;
  groupApplications?: any;
  styles?: any;
}

const GroupDetails: React.SFC<GroupDetailsProps> = ({
  group,
  groupUsers,
  groupApplications,
  styles,
}) =>
  !group ? (
    <EmptyContent styles={styles} message="Please select a group" />
  ) : (
    <Content
      styles={styles}
      data={{
        ...group,
        users: (
          <div>
            <Associator
              key={`${group.id}-user`}
              initialItems={groupUsers}
              fetchItems={getUsers}
              getName={user => `${user.lastName}, ${user.firstName[0]}`}
              onAdd={user => {
                addGroupToUser({ user, group: group });
              }}
              onRemove={user => {
                removeGroupFromUser({ user, group: group });
              }}
            />
            <NavLink to={`/groups/${group.id}/users`}>(placeholder link)</NavLink>
          </div>
        ),
        applications: (
          <div>
            <Associator
              key={`${group.id}-applications`}
              initialItems={groupApplications}
              fetchItems={getApps}
              onAdd={application => {
                addApplicationToGroup({ application, group: group });
              }}
              onRemove={application => {
                removeApplicationFromGroup({
                  application,
                  group: group,
                });
              }}
            />
            <NavLink to={`/groups/${group.id}/apps`}>(placeholder link)</NavLink>
          </div>
        ),
      }}
      keys={['name', 'description', 'id', 'status', 'users', 'applications']}
    />
  );

const contentWidth = 400;
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
    const selectedGroup = this.state.currentGroup as any;
    const selectedGroupId = _.get(this.props, 'match.params.id');
    const { currentUsers, currentApplications } = this.state;

    const shouldShowSubList = this.getShouldShowSublist();

    return (
      <div
        className={`GroupsPage row ${css(styles.container)}`}
        style={{
          transform: `translateX(${shouldShowSubList})`,
        }}
      >
        <div className={`Screen ${css(styles.screen)}`}>
          <ListPane
            Component={GroupListItem}
            getData={getGroups}
            selectedItem={selectedGroup}
            rowHeight={44}
            onSelect={group => {
              if (group.id === selectedGroupId) {
                this.props.history.push('/groups');
              } else {
                this.props.history.push(`/groups/${group.id}`);
              }
            }}
          />
          <GroupDetails
            group={selectedGroup}
            groupApplications={currentApplications}
            groupUsers={currentUsers}
            styles={{ minWidth: contentWidth, width: contentWidth }}
          />
        </div>
        {shouldShowSubList && (
          <div
            className={`Screen ${css(styles.screen, {
              position: 'relative',
              left: -contentWidth,
              background: '#fff',
            })}`}
          >
            <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
              <NavLink
                to={`/groups/${selectedGroupId}`}
                style={{ position: 'absolute', zIndex: 1 }}
              >
                (placeholder back button)
              </NavLink>
              <GroupDetails
                styles={{
                  boxShadow: '0 0 12px 0 rgba(0,0,0,0.1)',
                  minWidth: contentWidth,
                  width: contentWidth,
                }}
                group={selectedGroup}
                groupApplications={currentApplications}
                groupUsers={currentUsers}
              />
            </div>
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
        )}
      </div>
    );
  }
}
