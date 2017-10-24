import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import dummyUsers from './dummyData/users';

export const getUser = id => {
  return useDummyData
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}`).then(r => r.data);
};

export const getUserGroups = id => {
  return useDummyData
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}/groups`).then(r => r.data);
};

export const getUserApplications = id => {
  return useDummyData
    ? Promise.resolve(dummyUsers.find(user => id === user.id))
    : ajax.get(`/users/${id}/applications`).then(r => r.data);
};
