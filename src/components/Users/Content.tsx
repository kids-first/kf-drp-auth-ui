import React from 'react';
import { css } from 'glamor';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

const styles = {
  container: {
    padding: 60,
  },
};

export default ({ data }) => {
  return (
    <div className={`${css(styles.container)}`}>
      <Table basic="very" style={{ fontSize: 18 }}>
        <Table.Body>
          {[
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
          ].map(key => {
            return (
              <Table.Row key={key}>
                <Table.Cell style={{ fontSize: '0.7em', border: 'none' }}>
                  {_.upperCase(key)}
                </Table.Cell>
                <Table.Cell style={{ border: 'none' }}>{data[key]}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
