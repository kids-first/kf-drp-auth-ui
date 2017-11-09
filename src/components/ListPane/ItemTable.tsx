import React from 'react';
import _ from 'lodash';
import { css } from 'glamor';
import { compose, withPropsOnChange, defaultProps } from 'recompose';
import withSize from 'react-sizeme';
import { injectState } from 'freactal';
import { Icon } from 'semantic-ui-react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';

const enhance = compose(
  withSize({
    refreshRate: 100,
    monitorHeight: true,
  }),
  defaultProps({
    rowHeight: 40,
  }),
  injectState,
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width || props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    ({ size, rowHeight, effects: { updateList } }) => {
      const columns = 1;
      const rows = Math.max(Math.floor(size.height / rowHeight), 1);
      const limit = columns * rows;

      updateList({ limit });
    },
  ),
);

const ItemsWrapper = ({
  resource,
  selectedItemId,
  onSelect,
  styles,
  onRemove,
  state: { list: { resultSet, params: { offset, limit } } },
}) => {
  const columns = resource.schema.map(schema => ({
    Header: schema.fieldName,
    accessor: schema.key,
    sortable: schema.sortable,
  }));

  return (
    <div className={`items-wrapper`}>
      <ReactTable
        columns={columns}
        data={resultSet}
        showPagination={false}
        getTdProps={(state, rowInfo, column, instance) => ({
          onClick: () => onSelect(rowInfo.original),
        })}
      />
    </div>
  );
};

export default enhance(ItemsWrapper);
