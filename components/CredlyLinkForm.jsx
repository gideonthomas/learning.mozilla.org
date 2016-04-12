var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var _ = require('underscore');

var CredlyLinkForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return {
      email: "",
      password: "",
      validationErrors: []
    };
  },

  handleSubmit: function(e) {
    // Get the values, and then immediately forget them so
    // they don't hang around in this component's state.
    var email = this.state.email;
    var password = this.state.password;
    this.setState({ email: "", password: "" });
    this.props.linkAccounts(email, password);
    this.props.hideModal();
  },

  renderValidationErrors: function() {
    if (this.state.validationErrors.length) {
      return (
        <div className="alert alert-danger" role="alert">
          <p className="error-msg">Please enter an email address.</p>
        </div>
      );
    }
  },

  render: function() {
    return (
      <div>
        <fieldset>
          <label className="sr-only">email</label>
          <input name="email" type="email" size="30" placeholder="email@example.com" valueLink={this.linkState("email")} required />
        </fieldset>

        <fieldset>
          <label className="sr-only">password</label>
          <input name="password" type="password" size="30" valueLink={this.linkState("password")} required />
        </fieldset>

        <p className="pp-note">
          <i className="fa fa-checkmark"></i>
          I understand that I am creating a Credly account according to their <a href="http://example.com">privacy policy</a> and <a href="http://example.com">terms</a>.
          You will connect my accounts, but not store any of this information.
        </p>

        <input type="submit" className="btn btn-awsm center-block" onClick={this.handleSubmit} value="Link accounts"/>
      </div>
    )
  }
});

module.exports = CredlyLinkForm;
