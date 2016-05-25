var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

var fixLocation = require('../../lib/fix-location.js');

var IconLinks = require('../../components/icon-links.jsx');
var IconLink = require('../../components/icon-link.jsx');
var LoginLink = require('../../components/login.jsx').LoginLink;
var ModalAddOrChangeYourClub = require('../../components/modal-clubs.jsx');
var ModalRemoveYourClub = require('../../components/modal-clubs-remove.jsx');
var Illustration = require('../../components/illustration.jsx');
var ImageTag = require('../../components/imagetag.jsx');


// page 1
var StepOne = React.createClass({
  getInitialState: function() {
    return {
      name: null,
      location: null,
      occupation: null,
      regionalCoordinator: null,
      hostReason: null,
      howDidYouHear: null
    };
  },

  getTotal: function() {
    return Object.keys(this.state).length;
  },

  getFilled: function() {
    var state = this.state;
    return Object.keys(state).reduce(function(a,b) {
      b = state[b];
      b = b===null? 0 : b===false? 0 : b.length===0 ? 0 : 1;
      return a + b;
    }, 0);
  },

  setStateAsChange(state) {
    var props = this.props;
    this.setState(state, function() {
      props.onChange();
    });
  },

  render: function() {
    return (
      <div className="step1">
        <fieldset>
          <label>Name</label>
          <input type="text" value={this.state.name} onChange={this.updateName} placeholder="Your full name"/>
        </fieldset>
        <fieldset>
          <label>Location</label>
          <input type="text" value={this.state.location} onChange={this.updateLocation} placeholder="City, Country"/>
        </fieldset>
        <fieldset>
          <label>Occupation</label>
          <input type="text" value={this.state.occupation} onChange={this.updateOccupation} placeholder="Student or professional at ..."/>
        </fieldset>
        <fieldset>
          <label>Are you currently working with a Regional Coordinator?</label>
          <div>
            <input type="radio" name="regionalCoordinator" value="yes" checked={this.state.regionalCoordinator === 'yes'} onChange={this.updateRegionalCoordinator}/>Yes
            <input type="radio" name="regionalCoordinator" value="no" checked={this.state.regionalCoordinator === 'no'} onChange={this.updateRegionalCoordinator}/>No
          </div>
        </fieldset>
        <fieldset>
          <label>Why do you want to host a Mozilla Club?</label>
          <textarea value={this.state.hostReason} onChange={this.updateHostReason} placeholder="Describe what you want to achieve and what your goals are. Minimum length 100 words."/>
        </fieldset>
        <fieldset>
          <label>How did you hear about Mozilla Clubs?</label>
          <input type="text" value={this.state.howDidYouHear} onChange={this.updateHowDidYouHear} placeholder="Select response"/>
        </fieldset>
      </div>
    );
  },
  updateName: function(evt) { this.setStateAsChange({ name: evt.target.value }); },
  updateLocation: function(evt) { this.setStateAsChange({ location: evt.target.value }); },
  updateOccupation: function(evt) { this.setStateAsChange({ occupation: evt.target.value }); },
  updateRegionalCoordinator: function(evt) { this.setStateAsChange({ regionalCoordinator: (evt.target.value === 'yes') }); },
  updateHostReason: function(evt) { this.setStateAsChange({ hostReason: evt.target.value }); },
  updateHowDidYouHear: function(evt) { this.setStateAsChange({ howDidYouHear: evt.target.value }); }
});



// page 2
var StepTwo = React.createClass({
  getInitialState: function() {
    return {
      intent: null,
      clubName: null,
      meetingVenue: null,
      frequency: null,
      ageRange: [],
      clubSize: null,
      audienceType: null,
      meetingSubjects: null,
      affiliation: null,
      pledgeAgreement: false
    };
  },

  getTotal: function() {
    return Object.keys(this.state).length;
  },

  getFilled: function() {
    var state = this.state;
    return Object.keys(state).reduce(function(a,b) {
      b = state[b];
      b = b===null? 0 : b===false? 0 : b.length===0 ? 0 : 1;
      return a + b;
    }, 0);
  },

  setStateAsChange(state) {
    this.setState(state, function() {
      this.props.onChange();
    });
  },

  render: function() {
    return (
      <div className="step1">
        <fieldset>
          <label>Do you want to...</label>
          <div>
            <input type="radio" name="intent" value="start" checked={this.state.intent === 'start'} onChange={this.updateIntent}/>Start a club
            <input type="radio" name="intent" value="integrate" checked={this.state.intent === 'integrate'} onChange={this.updateIntent}/>Integrate a Mozilla Club with your existing program
          </div>
        </fieldset>
        <fieldset>
          <label>Name your club</label>
          <input type="text" value={this.state.clubName} onChange={this.updateClubName} placeholder=""/>
        </fieldset>
        <fieldset>
          <label>Where will you meet?</label>
          <input type="text" value={this.state.meetingVenue} onChange={this.updateMeetingVenue} placeholder="Name the venue, school, library, coffeeshop, university, etc..."/>
        </fieldset>
        <fieldset>
          <label>How often will you meet?</label>
          <div>
            <input type="radio" name="frequency" value="weekly" checked={this.state.frequency === 'weekly'} onChange={this.updateFrequency}/>Once a week
            <input type="radio" name="frequency" value="biweekly" checked={this.state.frequency === 'biweekly'} onChange={this.updateFrequency}/>Every other week
            <input type="radio" name="frequency" value="monthly" checked={this.state.frequency === 'monthly'} onChange={this.updateFrequency}/>Once a month
            <input type="radio" name="frequency" value="other" checked={this.state.frequency === 'other'} onChange={this.updateFrequency}/>Other:
            <input type="text"  disabled={this.state.frequency !== 'other'} value={this.state.frequencyOther} placeholder='...' onChange={this.updateFrequencyOther}/>
          </div>
        </fieldset>
        <fieldset>
          <label>What will the age range of your audence be?</label>
          <div>
            <input type="checkbox" value="12-"   checked={this.state.ageRange.indexOf("12-"  ) > -1} onChange={this.updateAgeRange}/>Under 12 years old
            <input type="checkbox" value="12-20" checked={this.state.ageRange.indexOf("12-20") > -1} onChange={this.updateAgeRange}/>12-20 years old
            <input type="checkbox" value="21-35" checked={this.state.ageRange.indexOf("21-35") > -1} onChange={this.updateAgeRange}/>21-35 years old
            <input type="checkbox" value="36-60" checked={this.state.ageRange.indexOf("36-60") > -1} onChange={this.updateAgeRange}/>35-60 years old
            <input type="checkbox" value="61+"   checked={this.state.ageRange.indexOf("61+"  ) > -1} onChange={this.updateAgeRange}/>61 years or older
            <input type="checkbox" value="other" checked={this.state.ageRange.indexOf("other") > -1} onChange={this.updateAgeRange}/>other:
            <input type="text"     disabled={this.state.ageRange.indexOf("other") === -1} value={this.state.ageRangeOther} placeholder='...' onChange={this.updateAgeRangeOther}/>
          </div>
        </fieldset>
        <fieldset>
          <label>What is the size of your club?</label>
          <div>
            <input type="radio" name="clubSize" value="1-5"   checked={this.state.clubSize === '1-5'} onChange={this.updateClubSize}/>1-5 members
            <input type="radio" name="clubSize" value="6-15"  checked={this.state.clubSize === '6-15'} onChange={this.updateClubSize}/>6-15 members
            <input type="radio" name="clubSize" value="16-30" checked={this.state.clubSize === '16-30'} onChange={this.updateClubSize}/>16-30 members
            <input type="radio" name="clubSize" value="31+"   checked={this.state.clubSize === '31+'} onChange={this.updateClubSize}/>31 or more members
          </div>
        </fieldset>
        <fieldset>
          <label>Which occupations will your audence have?</label>
          <input type="text" value={this.state.audienceType} onChange={this.updateAudienceType} placeholder="Students, professionals, community leaders, etc..."/>
        </fieldset>
        <fieldset>
          <label>What topics of subjects will you teach?</label>
          <input type="text" value={this.state.meetingSubjects} onChange={this.updateMeetingSubjects} placeholder="Web literacy, 21st century skills, online privacy, social media, etc..."/>
        </fieldset>
        <fieldset>
          <label>Affiliated institution or oganization</label> (optional)
          <input type="text" value={this.state.affiliation} onChange={this.updateAffiliation} placeholder="Name of the school, library, organization, etc..."/>
        </fieldset>

        <fieldset>
          <input type="checkbox" checked={this.state.pledgeAgreement} onChange={this.updatePledgeAgreement}/> I agree to the Mozilla Club Captain Pledge
        </fieldset>
      </div>
    );
  },

  updateIntent: function(evt) { this.setStateAsChange({ intent: evt.target.value }); },
  updateClubName: function(evt) { this.setStateAsChange({ clubName: evt.target.value }); },
  updateMeetingVenue: function(evt) { this.setStateAsChange({ meetingVenue: evt.target.value }); },
  updateFrequency: function(evt) { this.setStateAsChange({ frequency: evt.target.value }); },
  updateFrequencyOther: function(evt) { this.setStateAsChange({ frequencyOther: evt.target.value }); },
  updateAgeRange: function(evt) {
    var val = evt.target.value;
    var ar = this.state.ageRange;
    var pos = ar.indexOf(val);
    if (pos > -1) { ar.splice(pos,1); } else { ar.push(val); }
    this.setStateAsChange({ ageRange: ar });
  },
  updateAgeRangeOther: function(evt) { this.setStateAsChange({ ageRangeOther: evt.target.value }); },
  updateClubSize: function(evt) { this.setStateAsChange({ clubSize: evt.target.value }); },
  updateAudienceType: function(evt) { this.setStateAsChange({ audienceType: evt.target.value }); },
  updateMeetingSubjects: function(evt) { this.setStateAsChange({ meetingSubjects: evt.target.value }); },
  updateAffiliation: function(evt) { this.setStateAsChange({ affiliation: evt.target.value }); },
  updatePledgeAgreement: function(evt) { this.setStateAsChange({ pledgeAgreement: !this.state.pledgeAgreement }); },
});



var Progress = function(props) {
  var st = {
    display: 'inline-block',
    height: '10px',
    width: '50%',
    background: 'transparent',
    border: '1px solid grey',
    borderRadius: '5px'
  };
  var cr = {
    height: '10px',
    width: props.value + '%',
    background: 'lightblue',
    borderRadius: '5px'
  };
  return <div className="progressBar" style={{textAlign: 'center'}}>
    <div className="outer" style={st}><div className="inner" style={cr}/></div> {props.value}%
  </div>;
};



var ClubForm = React.createClass({
  statics: {
    pageTitle: "Club Form",
    pageClassName: "clubs"
  },
  contextTypes: {
    location: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      progress: 0,
      currentStep: 0,
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
              src1x="/img/pages/clubs/svg/icon-circle-clubs.svg"
              alt="">
              <h1>Apply to Become a Club Captain</h1>
              <h2>{this.state.headings[this.state.currentStep]}</h2>
            </Illustration>
          </section>

          <StepOne ref="step1" onChange={this.updateProgress} />
          <StepTwo ref="step2" onChange={this.updateProgress} />

          <button className="btn" onClick={this.nextStep}>Next</button>
          <Progress value={this.state.progress} />

        </div>
      </div>
    );
  },

  updateProgress: function() {
    var r1 = this.refs.step1;
    var r2 = this.refs.step2;
    if (!r1 || !r2) return 0;
    var total = r1.getTotal() + r2.getTotal();
    var filled = r1.getFilled() + r2.getFilled();
    this.setState({
      progress: (100*filled/total)|0
    });
  },

  nextStep: function() {
    // validate the current step's input
    //
    // ...

    //
    this.setState({
      currentStep: this.state.currentStep + 1
    });
  }
});

module.exports = ClubForm;
