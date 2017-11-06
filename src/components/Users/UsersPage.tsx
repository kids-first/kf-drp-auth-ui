import React from 'react';
import { css } from 'glamor';

import ListItem from './ListItem';
import PageContent from 'components/PageContent';

const styles = {
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    '&:not(.bump-specificity)': {
      flexWrap: 'initial',
    },
  },
};

class UsersPage extends React.Component<any, any> {
  render() {
    const id = this.props.match.params.id;

    return (
      <div className={`row ${css(styles.container)}`}>
        <PageContent id={id} ListItem={ListItem} type="users" />
      </div>
    );
  }
}

export default UsersPage;
