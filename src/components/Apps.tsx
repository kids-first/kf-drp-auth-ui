import React from 'react';
import { css } from 'glamor';
import { getApps, getApp } from 'services';
import Nav from 'components/Nav';
import List from 'components/List';
import Content from 'components/Content';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    flexWrap: 'initial',
  },
};

const App = ({ item: { name }, style, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
      {...props}
    >
      <div style={{ fontSize: 20 }}>{name}</div>
    </div>
  );
};

export default class extends React.Component<any, any> {
  state = { currentApp: null };

  fetchApp = async id => {
    const currentApp = await getApp(id);
    this.setState({ currentApp });
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.fetchApp(id);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.match.params.id;

    if (id && id !== this.props.match.params.id) {
      this.fetchApp(id);
    }
  }

  render() {
    return (
      <div className={`row ${css(styles.container)}`}>
        <Nav />
        <List
          Component={App}
          getKey={item => item.id}
          getData={getApps}
          onSelect={currentApp => {
            this.props.history.push(`/apps/${currentApp.id}`);
          }}
        />
        {this.state.currentApp && (
          <Content
            data={this.state.currentApp}
            keys={[
              'name',
              'clientId',
              'clientSecret',
              'description',
              'id',
              'redirectUri',
              'status',
            ]}
          />
        )}
      </div>
    );
  }
}
