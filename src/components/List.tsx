import React from 'react';
import { css } from 'glamor';
import withSize from 'react-sizeme';
import { compose, withPropsOnChange, defaultProps, withProps } from 'recompose';

import colors from 'common/colors';
import Pagination from 'components/Pagination';

interface IListProps {
  onSelect: Function;
  Component: any;
  getKey: Function;
  getData: Function;
  size: any;
  pageSize: number;
  styles: any;
}

interface IListState {
  items: any[];
  count: number;
  offset: number;
}

const styles = ({ columnWidth }) => ({
  container: {
    minWidth: columnWidth,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    overflowY: 'auto',
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    '& .items-wrapper': {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 1,
      justifyContent: 'space-evenly',
    },
  },

  listItem: {
    flexGrow: 1,
    cursor: 'pointer',
    padding: '0 1em',
    '&:hover': { backgroundColor: '#f0f0f0' },
  },
});

const enhance = compose(
  defaultProps({
    columnWidth: 230,
    rowHeight: 60,
  }),
  withSize({
    refreshRate: 20,
    monitorHeight: true,
  }),
  withProps(({ columnWidth }) => ({
    styles: styles({ columnWidth }),
  })),
  withPropsOnChange(
    (props, nextProps) =>
      (props.size.width !== nextProps.size.width ||
        props.size.height !== nextProps.size.height) &&
      nextProps.size.width !== 0,
    ({ size, columnWidth, rowHeight }) => {
      // TODO: move this HOC into the element that only renders the list, no extra elements to account for
      const extraVerticalSpace = 60;
      const columns = Math.floor(size.width / columnWidth);
      const rows = Math.floor((size.height - extraVerticalSpace) / rowHeight);
      const pageSize = columns * rows;
      return {
        pageSize,
      };
    },
  ),
);

class Component extends React.Component<IListProps, IListState> {
  state = {
    items: [],
    count: 0,
    offset: 0,
  };

  fetchData = async () => {
    const { getData, pageSize } = this.props;
    const { offset } = this.state;
    const { resultSet, count = 0 } = await getData(offset, pageSize);
    this.setState({ items: resultSet, count });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: IListProps, prevState: IListState) {
    if (
      prevProps.pageSize !== this.props.pageSize ||
      prevState.offset !== this.state.offset
    ) {
      this.fetchData();
    }
  }

  render() {
    const { onSelect, Component, getKey, size, pageSize, styles } = this.props;
    const { items, count, offset } = this.state;

    return (
      <div className={`List ${css(styles.container)}`}>
        <pre style={{ position: 'fixed', top: 0, right: 0 }}>
          {JSON.stringify(Object.assign({ pageSize }, size), null, '  ')}
        </pre>
        <div className={`items-wrapper`}>
          {items.map(item => (
            <Component
              item={item}
              style={styles.listItem}
              key={getKey(item)}
              onClick={() => onSelect(item)}
            />
          ))}
        </div>
        {pageSize < count && (
          <Pagination
            onChange={page => this.setState({ offset: page * pageSize })}
            offset={offset}
            limit={pageSize}
            total={count}
            range={3}
          />
        )}
      </div>
    );
  }
}

export default enhance(Component);
