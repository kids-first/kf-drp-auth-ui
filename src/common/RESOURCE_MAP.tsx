import {
  getGroups,
  getUsers,
  getApps,
  getUser,
  getUserGroups,
  getUserApplications,
  addApplicationToGroup,
  addApplicationToUser,
  removeApplicationFromUser,
  removeApplicationFromGroup,
  getGroupApplications,
  getGroupUsers,
  addGroupToUser,
  getGroup,
  removeGroupFromUser,
} from 'services';

import GroupListItem from 'components/Groups/ListItem';
import UserListItem from 'components/Users/ListItem';
import AppListItem from 'components/Applications/ListItem';

export default {
  users: {
    name: 'users',
    ListItem: UserListItem,
    getData: getUsers,
    rowHeight: 50,
    sortableFields: [
      { key: 'email', value: 'Email' },
      { key: 'role', value: 'Role' },
      { key: 'firstName', value: 'First Name' },
      { key: 'lastName', value: 'Last Name' },
      { key: 'createdAt', value: 'Date Created' },
      { key: 'lastLogin', value: 'Last Login Date' },
    ],
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
