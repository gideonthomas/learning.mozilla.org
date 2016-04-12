'use strict';

var React = require('react'),
    SocialShare = require('../components/social-share.jsx'),
    BadgeHorizontalIcon = require('../components/badge-horizontal-icon.jsx'),
    RequirementsList = require('../components/requirement-list.jsx'),
    LoginLink = require('../components/login/LoginLink.jsx'),
    Badge = require('../components/badge.jsx'),
    Divider = require('../components/Divider.jsx'),
    BadgesAPI = require('../lib/badges-api'),
    TeachAPI = require('../lib/teach-api'),
    Link = require('react-router').Link;

var Navigation = React.createClass({
  render: function() {
    return (
      <div className="badge-navigation">
        <a className="previous" href={this.props.prev.url}>
          <img src={this.props.prev.img} />
          <span clasName="label">← prev</span>
        </a>
        <a className="next" href={this.props.next.url}>
          <span clasName="label">next →</span>
          <img src={this.props.next.img} />
        </a>
      </div>
    );
  }
});

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
      },
      prev: false,
      next: false,
      evidenceLink: '',
      evidenceText: '',
      evidenceFiles: []
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

    console.log(bdata);

    var prev = false;
    if (data.prev) {
      prev = {
        url: '/badge/' + data.prev.id,
        img: data.prev.image_url
      };
    }

    var next = false;
    if (data.next) {
      next = {
        url: '/badge/' + data.next.id,
        img: data.next.image_url
      };
    }

    // FIXME: these need to be constants on the badgeAPI, probably
    status = Badge.eligible;
    if (data.earned) { status = Badge.achieved; }
    if (data.pending) { status = Badge.pending; }

    var reqs = bdata.require_claim_evidence_description;
    var matched = reqs.match(/((\d+(\.)?)?[^.]+)/g);

    this.setState({
      badge: {
        id: bdata.id,
        title: bdata.title,
        description: bdata.description,
        icon: bdata.image_url,
        icon2x: bdata.image_url,
        criteria: matched,
        status: status
      },
      prev: prev,
      next: next
    });
  },

  render: function () {
    var content = null;
    var user = this.state.teachAPI.getLoginInfo();
    if (!user) {
      content = this.renderAnonymousView();
    }
    else if (!this.state.badge.id) {
      content = this.renderLoadingView();
    }
    else if (this.state.badge.status === Badge.achieved) {
      content = this.renderAchieved();
    }
    else if (this.state.badge.status === Badge.pending) {
      content = this.renderPending();
    } else {
      content = this.renderEligible();
    }

    // This currently renders as "elligible" until the badge
    // data actually loads, which means people might see the
    // wrong state for a few seconds. We want to fix that.

    return (
      <div className="individual-badge">
        <div> <a href="/badges">← back to credentials</a> </div>
        <BadgeHorizontalIcon badge={this.state.badge} />
        { content }
        <Divider />
        <Navigation prev={this.state.prev} next={this.state.next} />
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

  renderLoadingView: function() {
    return (
      <div>
        <Divider/>
        <div style={{textAlign: 'center'}}>Loading badge details...</div>
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

  renderPending: function() {
    var badgeCriteria = this.formBadgeCriteria(this.state.badge.criteria);
    return (
      <div className="badge-pending">
        <h3 className={'text-light'}>Your badge claim is pending.</h3>
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


  renderEligible: function() {
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
    var showButton = this.state.evidenceText || this.state.evidenceLink || this.state.evidenceFiles.length > 0;

    return (
      <div className="apply-send-qualifications">
        <h3 className={'text-light'}>Apply for this badge</h3>

        <div className="horizontal-form">
          <fieldset>
            <label className="control-label">Tell us what qualifies you to earn this badge:</label>
            <textarea onChange={this.updateEvidenceText} value={this.state.evidenceText} placeholder="Describe what you've done to earn this badge..."/>
          </fieldset>

          <fieldset>
            <label className="control-label">Attach an (optional) link as part of your evidence:</label>
            <input type="text" placeholder="Give a link to a page to act as evidence" value={this.state.evidenceLink} onChange={this.updateEvidenceLink} />
          </fieldset>

          <fieldset>
            <input type="file" className="hidden" ref="optionalFile" onChange={this.handleFiles}/>
            <label className="control-label">Attach an (optional) file as part of your evidence:</label>
            <div>
              <button className="btn btw-awsm" onClick={this.selectFiles}>Click here to attachment a file</button>
            </div>
          </fieldset>

          <button className={"btn btn-awsm"} disabled={!showButton} onClick={this.claimBadge}>Apply</button>
        </div>
      </div>
    );
  },

  updateEvidenceText: function(evt) {
    this.setState({
      evidenceText: evt.target.value
    });
  },

  updateEvidenceLink: function(evt) {
    this.setState({
      evidenceLink: evt.target.value
    });
  },

  selectFiles: function() {
    this.refs.optionalFile.click();
  },

  handleFiles: function(evt) {
    var component = this;
    var files = evt.target.files;
    var attachments = [];
    Array.from(files).forEach(function(file) {
      var reader = new FileReader();
      reader.onload = (function(f) {
        return function(evt) {
          var name = escape(f.name);
          var data = evt.target.result;
          if (data) {
            data = data.substring(data.indexOf('base64,')+'base64,'.length);
            attachments.push({ name: name, file: data });
          }

          if(attachments.length === files.length) {
            component.setState({
              evidenceFiles: attachments
            });
          }
        };
      })(file);
      reader.readAsDataURL(file);
    });
  },

  claimBadge: function() {
    var evidences = [];

    if (this.state.evidenceText) {
      evidences.push({
        file: btoa(this.state.evidenceText),
        name: "Claim description"
      });
    }

    if (this.state.evidenceLink) {
      evidences.push({
        file: this.state.evidenceLink,
        name: "Proof of claim link"
      });
    }

    if (this.state.evidenceFiles.length > 0) {
      evidences = evidences.concat(this.state.evidenceFiles);
    }

    if (evidences.length === 0) {
      return console.error("a badge claim without evidence was attempted");
    }

    console.log(evidences);

    this.state.badgeAPI.claimBadge(this.state.badge.id, { evidences: evidences }, this.handleClaimRequest);
  },

  handleClaimRequest: function(err, data) {
    //window.location = window.location.toString();
  }
});

module.exports = BadgePage;
