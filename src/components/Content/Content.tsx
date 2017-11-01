import React from 'react';
import { css } from 'glamor';
import { Button } from 'semantic-ui-react';

import EmptyContent from 'components/EmptyContent';
import ContentTable from './ContentTable';
import EditingContentTable from './EditingContentTable';
import { compose } from 'recompose';
import { provideThing } from 'stateProviders';
import { injectState } from 'freactal';

const styles = {
  container: {
    minWidth: 500,
    boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
    position: 'relative',
  },
  paneControls: {
    backgroundColor: 'rgba(144, 144, 144, 0.05)',
    borderBottom: '1px solid #eaeaea',
    padding: '20px 24px',
    display: 'flex',
    minHeight: 80,
  },
  controls: {
    marginLeft: 'auto',
  },
  content: {
    paddingLeft: 60,
    paddingRight: 60,
  },
};

const INITIAL_STATE = { entity: null, editing: false, saving: false };

const enhance = compose(provideThing, injectState);

class Content extends React.Component<any, any> {
  state = INITIAL_STATE;

  fetchData = async ({ id, effects: { setItem }, type }) => {
    await setItem(id, type);
    this.setState({ ...INITIAL_STATE });
  };

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps: any) {
    const { id } = nextProps;
    if (id !== this.props.id) {
      this.fetchData(nextProps);
    }
  }

  render() {
    const {
      rows,
      styles: stylesProp = {},
      id,
      emptyMessage,
      effects: { saveChanges },
      state: { item },
    } = this.props;

    return (
      <div className={`content ${css(styles.container, stylesProp)}`}>
        <div className={`content-controls ${css(styles.paneControls)}`}>
          <div className={`${css(styles.controls)}`}>
            <Button
              onClick={async () => {
                if (this.state.editing) {
                  this.setState({ saving: true });
                  await saveChanges();
                  this.setState({ saving: false, editing: false, updates: null });
                } else {
                  this.setState({ editing: true });
                }
              }}
            >
              {this.state.editing ? 'save' : 'edit'}
            </Button>
            {this.state.editing && (
              <Button onClick={() => this.setState({ editing: false, updates: null })}>
                cancel
              </Button>
            )}
          </div>
        </div>
        <div className={`${css(styles.content)}`}>
          {!id ? (
            <EmptyContent message={emptyMessage} />
          ) : !item ? (
            <EmptyContent message={'loading'} />
          ) : this.state.editing ? (
            <EditingContentTable rows={rows} />
          ) : (
            <ContentTable rows={rows} />
          )}
        </div>
      </div>
    );
  }
}

export default enhance(Content);
