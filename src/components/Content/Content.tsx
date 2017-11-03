import React from 'react';
import { css } from 'glamor';
import { Button } from 'semantic-ui-react';

import EmptyContent from 'components/EmptyContent';
import ContentTable from './ContentTable';
import EditingContentTable from './EditingContentTable';
import { compose } from 'recompose';
import { provideThing } from 'stateProviders';
import { injectState } from 'freactal';
import ControlContainer from 'components/ControlsContainer';
import Aux from 'components/Aux';
import { withRouter } from 'react-router';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

const styles = {
  container: {
    minWidth: 500,
    boxShadow: '-2px 0 12px 0 rgba(0,0,0,0.1)',
    position: 'relative',
  },
  controls: { paddingRight: 24, paddingLeft: 24, justifyContent: 'space-between' },
  content: {
    paddingLeft: 60,
    paddingRight: 60,
    paddingTop: 30,
  },
};

const enhance = compose(provideThing, injectState, withRouter);

class Content extends React.Component<any, any> {
  state = { contentState: '' };

  fetchData = async ({ id, effects: { setItem }, type }) => {
    await setItem(id, type);
    this.setState({ contentState: '' });
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
      effects: { saveChanges, setItem, deleteItem, stageChange },
      state: { thing: { item, valid } },
      type,
      history,
    } = this.props;

    const { contentState } = this.state;

    const CreateButton = () => (
      <Button
        basic
        color="green"
        onClick={async () => {
          await setItem(null, type);
          this.setState({ contentState: 'creating' });
        }}
        size="tiny"
        style={{ fontWeight: 'bold' }}
      >
        Create
      </Button>
    );

    const EditButton = () => (
      <Button
        color="blue"
        onClick={() => this.setState({ contentState: 'editing' })}
        size="tiny"
        style={{ fontWeight: 'normal' }}
      >
        Edit
      </Button>
    );

    const DisableButton = () => (
      <Button
        basic
        disabled={contentState === 'disabling' || (item || {}).status === 'Disabled'}
        loading={contentState === 'disabling'}
        onClick={async () => {
          this.setState({ contentState: 'disabling' });
          await stageChange({ status: 'Disabled' });
          await saveChanges();
          this.setState({ contentState: '' });
        }}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Disable
      </Button>
    );

    const ConfirmDeleteButton = () => (
      <Button
        disabled={contentState === 'deleting'}
        loading={contentState === 'deleting'}
        onClick={async () => {
          this.setState({ contentState: 'deleting' });
          await deleteItem();
          history.replace(`/${type}`);
        }}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Confirm Delete
      </Button>
    );

    const DeleteButton = () => (
      <Button
        basic
        onClick={() => this.setState({ contentState: 'confirm-delete' })}
        size="tiny"
        color="red"
        style={{ fontWeight: 'bold' }}
      >
        Delete
      </Button>
    );

    const CancelButton = () => (
      <Button
        basic
        onClick={() => this.fetchData(this.props)}
        size="tiny"
        style={{ fontWeight: 'bold' }}
      >
        Cancel
      </Button>
    );

    const SaveButton = () => {
      const isSaving = contentState === 'saving';
      return (
        <Button
          color="blue"
          style={{ marginLeft: 'auto', fontWeight: 'normal' }}
          disabled={isSaving || !valid}
          loading={isSaving}
          onClick={async () => {
            this.setState({ contentState: 'saving' });
            const newState = await saveChanges();
            this.setState({ contentState: '' });
            history.replace(`/${type}/${newState.thing.item.id}`);
          }}
          size="tiny"
        >
          Save
        </Button>
      );
    };

    return (
      <div className={`content ${css(styles.container, stylesProp)}`}>
        <ControlContainer style={styles.controls}>
          {!['editing', 'creating'].includes(contentState) ? (
            <Aux>
              <div>
                <CreateButton />
                {id && <EditButton />}
              </div>
              {id &&
                (RESOURCE_MAP[type].noDelete ? (
                  <DisableButton />
                ) : contentState === 'confirm-delete' ? (
                  <ConfirmDeleteButton />
                ) : (
                  <DeleteButton />
                ))}
            </Aux>
          ) : (
            <Aux>
              <CancelButton />
              <SaveButton />
            </Aux>
          )}
        </ControlContainer>
        <div className={`${css(styles.content)}`}>
          {contentState === 'creating' ? (
            <EditingContentTable rows={rows} hideImmutable />
          ) : !id ? (
            <EmptyContent message={emptyMessage} />
          ) : !item ? (
            <EmptyContent message={'loading'} />
          ) : contentState === 'editing' ? (
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
