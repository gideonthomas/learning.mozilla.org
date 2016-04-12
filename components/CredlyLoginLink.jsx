var React = require('react');

var CredlyLoginLink = React.createClass({

  getInitialState: function() {
    return {
      email: "test@example.org",
      password: ''
    };
  },

  render: function() {
    var credlyboxstyle = {
      background: 'gold',
      width: '50%',
      padding: '0.5em 2em',
      margin: 'auto'
    };

    return (
      <div className="credlybox" style={credlyboxstyle}>
        <fieldset>
          <label>email</label>
          <input ref="email" type="email" value={this.state.email} onChange={this.updateEmail}/>
        </fieldset>
        <fieldset>
          <label>password</label>
          <input ref="password" type="password" value={this.state.password} onChange={this.updatePassword}/>
        </fieldset>
        <button onClick={this.doCredlyLogin}>Log into Credly</button>
      </div>
    );
  },

  updateEmail: function(evt) {
    var email = evt.target.value;
    this.setState({
      email: email
    });
    console.log("email", email);
  },

  updatePassword: function(evt) {
    var password = evt.target.value;
    this.setState({
      password: password
    });
    console.log("password", password);
  },

  doCredlyLogin: function(evt) {
    this.props.doLogin(this.state.email, this.state.password);
  }

});

module.exports = CredlyLoginLink;