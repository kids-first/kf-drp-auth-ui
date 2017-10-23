import React from 'react';
import _ from 'lodash';

export default class extends React.Component<any, any> {
  componentDidMount() {
    global.FB.getLoginStatus(response => {
      if (response.authResponse) {
        this.props.onLogin(response);
      } else {
        global.FB.Event.subscribe('auth.login', this.props.onLogin);
      }
    });
  }
  componentWillUnmount() {
    global.FB.Event.unsubscribe('auth.login', this.props.onLogin);
  }
  render() {
    return (
      <div
        {..._.omit(this.props, 'onLogin')}
        className="fb-login-button"
        data-max-rows="1"
        data-size="large"
        data-button-type="login_with"
        data-show-faces="false"
        data-auto-logout-link="false"
        data-use-continue-as="false"
      />
    );
  }
}
