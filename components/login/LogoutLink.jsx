var _ = require('underscore');
var React = require('react');
var ga = require('react-ga');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var config = require('../../config/config');

var exposeRouter = require('../../hoc/expose-router.jsx');

var LogoutLink = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    origin: React.PropTypes.string
  },
  getDefaultProps: function() {
    return {
      origin: config.ORIGIN
    };
  },
  render: function() {
    var callbackURL = this.props.origin + this.props.router.getCurrentPathname();
    var loginBaseURL = this.props.loginBaseURL;
    var href = loginBaseURL + '/auth/oauth2/logout?callback=' + encodeURIComponent(callbackURL);
    var props = _.extend({}, this.props, { href: href });
    return <a {...props}>{this.props.children}</a>;
  }
});

module.exports = exposeRouter(LogoutLink);