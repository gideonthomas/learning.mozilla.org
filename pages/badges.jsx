var React = require('react'),
    HeroUnit = require('../components/hero-unit.jsx'),
    IconLinks = require('../components/icon-links.jsx'),
    IconLink = require('../components/icon-link.jsx'),
    BadgeVerticalIcon = require('../components/badge-vertical-icon.jsx'),
    urlize = require('urlize').urlize,
    Link = require('react-router').Link,
    BadgesAPI = require('../lib/badges-api'),
    TeachAPI = require('../lib/teach-api'),
    LoginLink = require('../components/login/LoginLink.jsx'),
    CredlyLoginLink = require('../components/CredlyLoginLink.jsx'),
    Divider = require('../components/Divider.jsx');

var BadgesPage = React.createClass({
  statics: {
    pageTitle: 'Badges',
    pageClassName: 'badges'
  },

  getInitialState: function() {
    return {
      hasAccess: false,
      badges: [],
      teachAPI: this.props.teachAPI || new TeachAPI(),
      badgeAPI: false
    };
  },

  toggleAccess: function(err, result) {
    result = result || { access: false };
    this.setState({
      hasAccess: result.access
    });
  },

  componentDidMount: function () {
    var badgeAPI = new BadgesAPI({ teachAPI: this.state.teachAPI });
    this.setState({ badgeAPI: badgeAPI });

    // steo 1: retrieve the list of all available MLN badges
    badgeAPI.listBadges(this.setBadgesData);

    // we're also interested in whether this user is credly-authenticated
    badgeAPI.hasAccess(this.toggleAccess, function(err, data) {
      if (err) return console.error("not logged into credly");
    });
  },

  setBadgesData: function (err, data) {
    this.setState({
      badges: this.parseBadges(err, data)
    });
  },

  parseBadges: function (err, response) {
    // do parsing here
    var data = [];
    var earned = response.earned || [];
    var pending = response.pending || [];
    var noUser = (this.state.teachAPI.getLoginInfo() === null);

    if (err) {
      console.error(err);
      return data;
    }

    data = response.badges.map(function (badge) {
      var interpreted = {
        'title': badge.title,
        'description': badge.short_description || '',
        'icon': badge.image_url,
        'icon2x': badge.image_url,
        'id': badge.id,
      };

      // order matters: 'earned' also contains pending-badges due to how Credly works.
      if (noUser) {
        interpreted.status = false;
      } else if (pending.indexOf(badge.id) !== -1) {
        interpreted.status = "pending";
      } else if (earned.indexOf(badge.id) !== -1) {
        interpreted.status = "achieved";
      } else {
        interpreted.status = "eligible";
      }

      return interpreted;
    });

    return data;
  },

  render: function () {

    var loginComponent = this.formLoginBlock();
    var credlyLoginComponent = null; //this.formCredlyLoginBlock();

    return (
      <div>
        <HeroUnit>
          <h1>Credentials</h1>

          <p className="text-center sub-title">Earn credentials to demonstrate you have the skills to teach
            the web.</p>
          <section>
            <IconLinks>
              <IconLink
                link="https://discourse.webmaker.org/t/if-youre-new-to-the-community-please-introduce-yourself"
                imgSrc="/img/pages/badges/svg/icon-explore.svg"
                head="Explore"
                subhead="See all badges we offer and which ones you qualify for."
              />
              <IconLink
                link="https://discourse.webmaker.org/t/if-youre-new-to-the-community-please-introduce-yourself"
                imgSrc="/img/pages/badges/svg/icon-earn.svg"
                head="Earn"
                subhead="Apply for badges by sharing your experiences."
              />
              <IconLink
                link="https://discourse.webmaker.org/t/if-youre-new-to-the-community-please-introduce-yourself"
                imgSrc="/img/pages/badges/svg/icon-share.svg"
                head="Share"
                subhead="Show your employers and friends you have the skills."
              />
            </IconLinks>
          </section>
        </HeroUnit>

        { loginComponent }
        { credlyLoginComponent }

        <div className="inner-container badges-content">
          <section>
            <h2 className="text-center">Earn 21st Century Skill Credentials</h2>

            <p className="text-center">Certain skills are critical to becoming a citizen of the web — like
              the ability to communicate, collaborate and create online. Hone these skills and earn badges
              that spotlight your expertise.</p>

            <div className="sep-16"></div>
            <div className="row">
            { this.generateBadgeList() }
            </div>
          </section>
        </div>
      </div>
    );
  },

  formLoginBlock: function() {
    if (this.state.teachAPI.getLoginInfo() !== null) return null;

    return (
      <div className="signinblock" style={{ marginTop: '4em' }}>
        <Divider className="badges"/>

        <div className={'text-center login-cta'}>
          <span className={'login-text'}>Sign in to start earning credentials.</span>
          <LoginLink className="btn btn-awsm" loginBaseURL={this.state.teachAPI.baseURL} callbackURL={this.props.currentPath}>Sign in</LoginLink>
        </div>

        <Divider className="badges"/>
      </div>
    );
  },

  handleCredlyLogin: function(email, password) {
    this.state.badgeAPI.ensureLogin(email, password);
  },

  formCredlyLoginBlock: function() {
    if (this.state.hasAccess) return null;

    return (
      <div className="signinblock" style={{ marginTop: '4em' }}>
        <Divider className="badges"/>
        <div className={'text-center login-cta'}>
          <span className={'login-text'}>It looks like we do not have a Credly token for you yet. Link us to your Credly account, or sign up for one, to start earning badges!</span>
          <CredlyLoginLink doLogin={this.handleCredlyLogin}>Tell Credly you want to earn badges with us</CredlyLoginLink>
        </div>
        <Divider className="badges"/>
      </div>
    );
  },

  generateBadgeList: function() {
    var anonymous = !this.state.teachAPI.getLoginInfo();

    if (this.state.badges.length === 0) {
      return (
        <div>
          <Divider/>
          <div style={{textAlign: 'center'}}>Loading badges...</div>
          <Divider/>
        </div>
      );
    }

    return this.state.badges.map(function (badge) {
      var linkUrl = '/badge/' + badge.id + '/' + urlize(badge.title);
      return (
        <div key={badge.id} className="col-md-4">
          <Link to={ linkUrl } className={'badge-icon-link'}>
            <BadgeVerticalIcon badge={badge} anonymous={anonymous} />
          </Link>
        </div>
      );
    });
  }

});
module.exports = BadgesPage;
