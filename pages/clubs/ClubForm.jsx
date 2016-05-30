var React = require('react');
var ReactDOM = require('react-dom');
var fixLocation = require('../../lib/fix-location.js');
var Illustration = require('../../components/illustration.jsx');


var ProgressBar = require('./ProgressBar.jsx');
var StepOne = require('./StepOne.jsx');
var StepTwo = require('./StepTwo.jsx');
var StepThree = require('./StepThree.jsx');

var ClubForm = React.createClass({
  statics: {
    pageTitle: "Apply to Become a Club Captain",
    pageClassName: "clubs-form"
  },
  contextTypes: {
    location: React.PropTypes.object
  },
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
      ]
    };
  },
  componentWillMount: function() {
    fixLocation(this.context.location);
  },
  componentDidMount: function() {
    this.updateProgress();
  },
  render: function() {
    return (
      <div>
        <div className="inner-container">
          <section className="intro intro-after-banner">
            <Illustration
              height={""} width={204}
              src1x="/img/pages/clubs/svg/icon-circle-clubs-form.svg"
              alt="">
              <h1>{this.state.titles[this.state.currentStep]}</h1>
              <h2>{this.state.headings[this.state.currentStep]}</h2>
            </Illustration>
          </section>

          <StepOne ref="step1" onChange={this.updateProgress} hidden={this.state.currentStep !== 0 }/>
          <StepTwo ref="step2" onChange={this.updateProgress} hidden={this.state.currentStep !== 1 }/>
          <StepThree ref="step3" hidden={this.state.currentStep !== 2 } onClick={this.generateReport}/>

          { this.generateButtons() }
        </div>
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

module.exports = ClubForm;
