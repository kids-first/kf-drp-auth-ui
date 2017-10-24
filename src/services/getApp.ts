import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import dummyApplications from './dummyData/applications';

export const getApp = id => {
  return useDummyData
    ? Promise.resolve(dummyApplications.find(app => id === app.id))
    : ajax.get(`/applications/${id}`).then(r => r.data);
};

export const getAppUsers = id => {
  return useDummyData
    ? Promise.resolve(dummyApplications.find(app => id === app.id))
    : ajax.get(`/applications/${id}/users`).then(r => r.data);
};

export const getAppGroups = id => {
  return useDummyData
    ? Promise.resolve(dummyApplications.find(app => id === app.id))
    : ajax.get(`/applications/${id}/groups`).then(r => r.data);
};
