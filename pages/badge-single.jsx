'use strict';

var React = require('react'),
    SocialShare = require('../components/social-share.jsx'),
    BadgeHorizontalIcon = require('../components/badge-horizontal-icon.jsx'),
    RequirementsList = require('../components/requirement-list.jsx'),
    LoginLink = require('../components/login/LoginLink.jsx'),
    Badge = require('../components/badge.jsx'),
    BadgesAPI = require('../lib/badges-api'),
    TeachAPI = require('../lib/teach-api'),
    Link = require('react-router').Link;

var Navigation = React.createClass({
  render: function() {
    return (
      <div>
        <a href={this.props.prev}>prev</a>,
        <a href={this.props.next}>next</a>,
        <a href={this.props.main}>Back to the badge list</a>
      </div>
    );
  }
});

module.exports = Navigation;

/**
 * Single badge Page
 * should take a badgeId
 */
var BadgePage = React.createClass({
  statics: {
    pageTitle: 'Badges',
    pageClassName: 'badges single-badge'
  },
  contextTypes: {
    history: React.PropTypes.object
  },
  getInitialState: function () {
    var teachAPI = this.props.teachAPI || new TeachAPI();
    var badgeAPI = new BadgesAPI({ teachAPI: teachAPI });
    return {
      teachAPI: teachAPI,
      badgeAPI: badgeAPI,
      badge: {
        id: "",
        title: "",
        status: '',
        description: "",
        icon: "",
        icon2x: "",
        criteria: []
      }
    };
  },
  componentDidMount: function() {
    this.state.badgeAPI.getBadgeDetails(this.props.params.id, this.handleBadgeData);
  },
  handleBadgeData: function(err, data) {
    if (err) {
      return console.error('Error in fetch badge information', err);
    }
    this.parseBadgeDetails(data);
  },
  parseBadgeDetails: function(data) {
    var bdata = data.badge;
    this.setState({ badge: {
      id: bdata.id,
      title: bdata.title,
      description: bdata.description,
      icon: bdata.image_url,
      icon2x: bdata.image_url,
      criteria: (bdata.criteria || '').split(/\r?\n/),
      status: data.earned? "achieved" : "unclaimed" // FIXME: these need to be constants on the badgeAPI, probably
    }});
  },

  render: function () {
    var content = null;
    var user = this.state.teachAPI.getLoginInfo();
    if (!user) {
      content = this.renderAnonymousView();
    }
    else if (this.state.badge.status === "achieved") {
      content = this.renderAchieved();
    }
    else if (this.state.badge.status === "pending") {
      content = this.renderPending();
    } else {
      content = this.renderAvailable();
    }
    return (
      <div className="individual-badge">
        <BadgeHorizontalIcon badge={this.state.badge} />
        { content }
        <Navigation prev={this.props.prev} next={this.props.next} main={'/badges'} />
      </div>
    );
  },

  renderAnonymousView: function() {
    // FIXME: TODO: hook up login link properly
    return (
      <div>
        <LoginLink loginBaseURL={this.state.teachAPI.baseURL} callbackURL={this.props.currentPath}>Sign in</LoginLink><span> to earn this badge!</span>
      </div>
    );
  },

  renderAchieved: function() {
    var badgeCriteria = this.formBadgeCriteria(this.state.badge.criteria);
    // FIXME: TODO: retrieve the information on when/how this badge was earned.
    //              ... IF we use this information at all.
    return (
      <div className="badge-achieved">
        <h3 className={'text-light'}>Congrats, you were awarded this credential.</h3>
        <SocialShare />
        <div className="badge-reward-text">
          <div className="date">
            DATE FROM API (although we may not end up using this);
          </div>
          <div className="qualifications">
            EVIDENCE FOR THIS BADGE, FROM API (although we may not end up using this)
          </div>
        </div>
      </div>
    );
  },

  renderAvailable: function() {
    var badgeCriteria = this.formBadgeCriteria(this.state.badge.criteria);
    return (
      <div className="badge-available">
        { badgeCriteria }
        { this.renderApplicationForm() }
      </div>
    );
  },

  formBadgeCriteria: function(list) {
    // FIXME: TODO: make this a local component
    return (
      <div className="badge-requirement" key={''}>
        <h3 className={'text-light'}>Badge Requirements</h3>
        <p>Make or write something that demonstrates your understanding of any two or more of the following:</p>
        <RequirementsList list={list} icon="fa fa-check"/>
      </div>
    );
  },

  renderApplicationForm: function() {
    return (
      <div className="apply-send-qualifications">
        <p><strong className={'text-bold'}>Ideas?</strong> You could submit a blog post, a project you made
          using Mozilla's tools, or another web creation you made. Demonstrate your understanding in your
          own unique way!</p>
        <h3 className={'text-light'}>Apply for this badge</h3>
        <form className="horizontal-form" role="form" onSubmit={this.onQualificationsSubmit}>
          <div className="form-group">
            <label htmlFor="qualifications" className="control-label">What qualifies you to earn this
              badge?</label>
            <textarea
              name="qualifications"
              ref="qualifications"
              id="qualifications"
              cols="30"
              rows="10"
              className="form-control"
              placeholder="I've earned this badge by working on this project: [link]. My project demonstrates an understanding of [skill/competency] through [explain further]."></textarea>
          </div>

          <div className="optional-file-input">
            <input type="file" className="hidden" name="optional_file" id="optional_file"
                 ref="optionalFile"/>
            <button type="button" ref="optionalFileBtn" className="btn btn-link"
                onClick={this.handleFileSelect}>Add Optional Attachment(s)
            </button>
          </div>

          <div>
            <button type="submit" className="btn btn-awsm">Apply</button>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = BadgePage;
