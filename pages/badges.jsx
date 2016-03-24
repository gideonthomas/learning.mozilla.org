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
    Divider = require('../components/Divider.jsx');

var BadgesPage = React.createClass({
  statics: {
    pageTitle: 'Badges',
    pageClassName: 'badges'
  },
  getInitialState: function() {
    return {
      'badges' : [],
      'teachAPI' : this.props.teachAPI || new TeachAPI()
    };
  },
  componentDidMount: function () {
    var BadgesInterface = new BadgesAPI({
      teachAPI: this.state.teachAPI
    });
    BadgesInterface.listBadges(this.setBadgesData);
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
    var noUser = (this.state.teachAPI.getLoginInfo() === null);

    if (err) {
      console.error(err);
      return data;
    }

    console.log(response.badges);

    data = response.badges.map(function (badge) {
      var interpreted = {
        'title': badge.title,
        'description': badge.short_description || '',
        'icon': badge.image_url,
        'icon2x': badge.image_url,
        'id': badge.id,
      };

      if (badge.is_claimable || badge.is_giveable) {
        interpreted.status = "unclaimed";
      } else {
        interpreted.status = "reserved";
      }

      if (noUser) {
        interpreted.status = "available";
      } else if (earned.indexOf(badge.id) !== -1) {
        interpreted.status = "achieved";
      }

      return interpreted;
    });

    return data;
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
  render: function () {
    var loginComponent = this.formLoginBlock();

    var badgesView = this.state.badges.map(function (badge) {
      var linkUrl = '/badge/' + badge.id + '/' + urlize(badge.title);
      return (
        <div key={badge.id} className="col-md-4">
          <Link to={ linkUrl } className={'badge-icon-link'}>
            <BadgeVerticalIcon badge={badge} />
          </Link>
        </div>
      );
    });

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

        <div className="inner-container badges-content">
          <section>
            <h2 className="text-center">Earn 21st Century Skill Credentials</h2>

            <p className="text-center">Certain skills are critical to becoming a citizen of the web — like
              the ability to communicate, collaborate and create online. Hone these skills and earn badges
              that spotlight your expertise.</p>

            <div className="sep-16"></div>
            <div className="row">
            { badgesView }
            </div>
          </section>
        </div>
      </div>
    );
  }
});
module.exports = BadgesPage;
