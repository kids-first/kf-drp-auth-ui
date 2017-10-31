import React from 'react';
import { css } from 'glamor';

import EmptyContent from 'components/EmptyContent';
import ContentTable from './ContentTable';
import EditingContentTable from './EditingContentTable';

const styles = {
  container: {
    padding: 60,
    minWidth: 500,
    boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
    position: 'relative',
  },
};

const INITIAL_STATE = { data: null, editing: false, saving: false };
export default class Content extends React.Component<any, any> {
  state = INITIAL_STATE;
  content = { save: () => Promise.resolve() };
  fetchData = async ({ getData, id }) => {
    const data = await getData(id);

    this.setState({ ...INITIAL_STATE, data });
  };

  componentDidMount() {
    if (this.props.id) {
      this.fetchData(this.props);
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const id = nextProps.id;
    if (id !== this.props.id) {
      if (id) {
        this.fetchData(nextProps);
      } else {
        this.setState(INITIAL_STATE);
      }
    }
  }

  render() {
    const { rows, styles: stylesProp = {}, id, emptyMessage } = this.props;
    const data = this.state.data as any;

    return (
      <div className={`Content ${css(styles.container, stylesProp)}`}>
        <button
          onClick={() => {
            if (this.state.editing) {
              this.setState({ saving: true });

              this.content
                .save()
                .then(() => this.fetchData(this.props))
                .then(() => this.setState({ saving: false, editing: false, updates: null }));
            } else {
              this.setState({ editing: true });
            }
          }}
        >
          {this.state.editing ? 'save' : 'edit'}
        </button>
        {this.state.editing && (
          <button onClick={() => this.setState({ editing: false, updates: null })}>cancel</button>
        )}
        {!id || !data ? (
          <EmptyContent message={!id ? emptyMessage : 'loading'} />
        ) : this.state.editing ? (
          <EditingContentTable
            rows={rows}
            data={data}
            ref={r => (this.content = r)}
            updateData={this.props.updateData}
          />
        ) : (
          <ContentTable rows={rows} data={data} />
        )}
      </div>
    );
  }
}
