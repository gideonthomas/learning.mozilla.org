var _ = require('underscore');
var request = require('superagent');
var ga = require('react-ga');
var TeachAPI = require('./teach-api');

function BadgesAPI(options) {
  options = options || {};
  this.teachAPI = options.teachAPI || new TeachAPI();
  this.baseURL = options.baseURL || TeachAPI.getDefaultURL();
  this.credlyEndPoint = '/credly';
}

BadgesAPI.prototype = {
  credlyURL: function (action) {
    action = action || "";
    return this.baseURL + this.credlyEndPoint + action;
  },
  listBadges : function (callback) {
    request
      .get(this.credlyURL('/badgelist'))
      .withCredentials()
      .accept('json')
      .end(function (err, res) {
        if (err) {
          console.log('login:error', err);
          return callback(err, res);
        }

        callback(err, res.body);
      });
  },
  getBadgeDetails: function (badgeId, callback) {
    request
      .get(this.credlyURL('/badges/' + badgeId))
      .end(function (err, res) {
        callback(err, res);
      });
  },
  testStuff: function(ap) {
    ap = ap || 'auth';
    request.get(this.baseURL + '/' + ap + '/status')
      .withCredentials()
      .accept('json')
      .end(function(err, res) {
        var currentUsername;

        if (err) {
          console.log('login:error', err);
          return;
        }

        if (res.body.username) {
          currentUsername = this.teachAPI.getUsername();

          if (res.body.username !== currentUsername) {
            console.log('username:change', res.body.username);
          }

          console.log('login:success', res.body);
        } else {
          console.log("no username in body");
        }
      }.bind(this));
  }
};

module.exports = BadgesAPI;
