import _ from 'lodash';
import ajax from 'services/ajax';
import { useDummyData } from 'common/injectGlobals';
import queryString from 'querystring';
import { Application } from 'common/typedefs/Application';

import dummyApplications from './dummyData/applications';

export const getApps = ({
  offset = 0,
  limit = 20,
  query = '',
  sortField,
  sortOrder,
}): Promise<{ count: number; resultSet: Application[] }> => {
  return useDummyData
    ? Promise.resolve({
        count: dummyApplications.length,
        resultSet: dummyApplications.slice(offset, offset + limit),
      })
    : ajax
        .get(
          `/applications?${queryString.stringify(
            _.omitBy({ limit, offset, query, sort: sortField, sortOrder }, _.isNil),
          )}`,
        )
        .then(r => r.data);
};
