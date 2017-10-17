import React from 'react';
import { css } from 'glamor';
import colors from 'common/colors';
import { getApps } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
  list: {
    minWidth: 300,
    background: colors.lightGrey,
    borderRight: `1px solid ${colors.grey}`,
    padding: '0 30px 20px',
    overflowY: 'auto',
    flex: 'none',
  },
  content: {},
};

const App = ({ item: { name }, style, ...props }) => {
  return (
    <div style={{ padding: '20px 0', ...style }} {...props}>
      <div style={{ fontSize: 20 }}>{name}</div>
    </div>
  );
};

const Content = ({ data }) => {
  return <div className={`${css(styles.content)}`}>{JSON.stringify(data)}</div>;
};

export default class extends React.Component {
  state = {
    currentApp: null,
  };

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={App}
          getKey={item => item.id}
          getData={getApps}
          onSelect={currentApp => this.setState({ currentApp })}
        />
        {this.state.currentApp && <Content data={this.state.currentApp} />}
      </div>
    );
  }
}
