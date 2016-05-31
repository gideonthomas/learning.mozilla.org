var React = require('react');
var ReactDOM = require('react-dom');
var Illustration = require('../../components/illustration.jsx');
var LoginLink = require('../../components/login/LoginLink.jsx');

var withTeachAPI = require('../../hoc/with-teach-api.jsx');


var ProgressBar = require('./ProgressBar.jsx');
var StepOne = require('./StepOne.jsx');
var StepTwo = require('./StepTwo.jsx');
var StepThree = require('./StepThree.jsx');

var ClubForm = React.createClass({
  getInitialState: function() {
    return {
      progress: 0,
      currentStep: 0,
      titles: [
        "Apply to Become a Club Captain",
        "Apply to Become a Club Captain",
        "Thanks for Applying!"
      ],
      headings: [
        'Tell us more about you!',
        'About your Club...',
        'You just took the first step on your journey toward becoming a Mozilla Club Captain. Please check your email for further information.'
      ],
      loginHeading: 'Sign in to fill in the application form.'
    };
  },
  componentDidMount: function() {
    this.updateProgress();
  },
  render: function() {
    var teachAPI = this.props.teachAPI;
    var username = teachAPI.getUsername();

    return (
      <div className="clubs-form">
        <div className="inner-container">
          <section className="intro intro-after-banner">
            <Illustration
              height={""} width={204}
              src1x="/img/pages/clubs/svg/icon-circle-clubs-form.svg"
              alt="">
              <h1>{ this.state.titles[this.state.currentStep] }</h1>
              <h2>{ username ? this.state.headings[this.state.currentStep] : this.state.loginHeading }</h2>
            </Illustration>
          </section>
          { username ? this.renderSteps() : this.renderLoginRequest() }
        </div>
      </div>
    );
  },

  renderSteps: function() {
    return [
      <StepOne ref="step1" onChange={this.updateProgress} hidden={this.state.currentStep !== 0 }/>,
      <StepTwo ref="step2" onChange={this.updateProgress} hidden={this.state.currentStep !== 1 }/>,
      <StepThree ref="step3" hidden={this.state.currentStep !== 2 } onClick={this.generateReport}/>,
      this.generateButtons()
    ];
  },

  renderLoginRequest: function() {
    return (
      <div className="login-request">
        You must be <LoginLink loginBaseURL={this.props.teachAPI.baseURL} callbackURL={this.props.currentPath}>signed in</LoginLink> to apply to become a Club Captain.
      </div>
    );
  },

  generateButtons: function() {
    if (this.state.currentStep === 2) return null;
    var buttons = [];
    if (this.state.currentStep > 0) {
      buttons.push(
        <button className="back btn" onClick={this.prevStep}>Back</button>
      );
    }
    buttons.push(
      <button className="btn" onClick={this.nextStep}>{this.state.currentStep===1 ? 'Submit' : 'Next'}</button>
    );
    return (
      <div className="proceed">
        <div>{buttons}</div>
        { (this.state.currentStep < 2) ? <ProgressBar value={this.state.progress}/> : null }
      </div>
    );
  },

  updateProgress: function() {
    var r1 = this.refs.step1;
    var r2 = this.refs.step2;
    if (!r1 || !r2) return 0;
    var total = r1.getTotal() + r2.getTotal();
    var filled = r1.getFilled() + r2.getFilled();
    var percent = (100*filled/total) | 0;
    this.setState({ progress: percent });
  },

  prevStep: function() {
    this.setState({
      currentStep: Math.max(this.state.currentStep - 1, 0)
    });
  },

  nextStep: function() {
    var refname = 'step' + (this.state.currentStep+1)
    console.log(refname);
    var curRef = this.refs[refname];
    var validates = curRef.validates();
    console.log("validates:", validates);
    if (validates) {
      this.setState({
        currentStep: Math.min(this.state.currentStep + 1, 2)
      });
    }
  },

  generateReport: function() {
    var r1 = this.refs.step1;
    var r2 = this.refs.step2;
    if (!r1 || !r2) return 0;
    var report = r1.generateReport().concat(r2.generateReport());
    alert(report.join('\n'));
  }
});

module.exports = withTeachAPI(ClubForm);
