var React = require('react');
var ReactDOM = require('react-dom');

var startlabels = {
  clubName: "Name your club",
  meetingVenue: "Where will you meet",
  frequency: "How often will you meet?",
  ageRange: "What will the age range of your audience be?",
  clubSize: "What is the size of your club?",
  audienceType: "What occupations will your audience have?",
  meetingSubjects: "What topics/subjects will you teach?"
}

var integrateLabels = {
  clubName: "Name of your existing program",
  meetingVenue: "Where do you meet",
  frequency: "How often do you meet?",
  ageRange: "What is the age range of your audience?",
  clubSize: "What is the size of your club?",
  audienceType: "What occupations does your audience have?",
  meetingSubjects: "What topics/subjects do you teach?"
}

var labels = {
  start: startlabels,
  integrate: integrateLabels
};

var StepTwo = React.createClass({
  getInitialState: function() {
    this.optional = ['affiliation'];
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
    var optional = this.optional;
    return Object.keys(this.state).filter(function(key) {
      return optional.indexOf(key) === -1;
    }).length;
  },

  getFilled: function() {
    var state = this.state;
    var optional = this.optional;
    return Object.keys(state).reduce(function(a,b) {
      b = state[b];
      b = b===null? 0 : b===false? 0 : b.length===0 ? 0 : optional.indexOf(b)>-1 ? 0 : 1;
      return a + b;
    }, 0);
  },

  setStateAsChange(state) {
    this.setState(state, function() {
      this.props.onChange();
    });
  },

  render: function() {
    var className = "step2" + (this.props.hidden ? " hidden" : "");
    return (
      <div className={className}>
        <fieldset>
          <label>Do you want to...</label>
          <div>
            <input type="radio" name="intent" value="start" checked={this.state.intent === 'start'} onChange={this.updateIntent}/>Start a club
            <input type="radio" name="intent" value="integrate" checked={this.state.intent === 'integrate'} onChange={this.updateIntent}/>Integrate a Mozilla Club with your existing program
          </div>
        </fieldset>

        { this.generateRest() }
      </div>
    );
  },

  generateRest: function() {
    if (!this.state.intent) return null;
    return <div>
      <fieldset>
        <label>{ labels[this.state.intent].clubName }</label>
        <input type="text" value={this.state.clubName} onChange={this.updateClubName} placeholder=""/>
      </fieldset>
      <fieldset>
        <label>{ labels[this.state.intent].location }</label>
        <input type="text" value={this.state.meetingVenue} onChange={this.updateMeetingVenue} placeholder="Name the venue, school, library, coffeeshop, university, etc..."/>
      </fieldset>
      <fieldset>
        <label>{ labels[this.state.intent].frequency }</label>
        <div>
          <input type="radio" name="frequency" value="weekly" checked={this.state.frequency === 'weekly'} onChange={this.updateFrequency}/>Once a week
          <input type="radio" name="frequency" value="biweekly" checked={this.state.frequency === 'biweekly'} onChange={this.updateFrequency}/>Every other week
          <input type="radio" name="frequency" value="monthly" checked={this.state.frequency === 'monthly'} onChange={this.updateFrequency}/>Once a month
          <input type="radio" name="frequency" value="other" checked={this.state.frequency === 'other'} onChange={this.updateFrequency}/>Other:
          <input type="text"  disabled={this.state.frequency !== 'other'} value={this.state.frequencyOther} placeholder='...' onChange={this.updateFrequencyOther}/>
        </div>
      </fieldset>
      <fieldset>
        <label>{ labels[this.state.intent].ageRange }</label>
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
        <label>{ labels[this.state.intent].clubSize }</label>
        <div>
          <input type="radio" name="clubSize" value="1-5"   checked={this.state.clubSize === '1-5'} onChange={this.updateClubSize}/>1-5 members
          <input type="radio" name="clubSize" value="6-15"  checked={this.state.clubSize === '6-15'} onChange={this.updateClubSize}/>6-15 members
          <input type="radio" name="clubSize" value="16-30" checked={this.state.clubSize === '16-30'} onChange={this.updateClubSize}/>16-30 members
          <input type="radio" name="clubSize" value="31+"   checked={this.state.clubSize === '31+'} onChange={this.updateClubSize}/>31 or more members
        </div>
      </fieldset>
      <fieldset>
        <label>{ labels[this.state.intent].audienceType }</label>
        <input type="text" value={this.state.audienceType} onChange={this.updateAudienceType} placeholder="Students, professionals, community leaders, etc..."/>
      </fieldset>
      <fieldset>
        <label>{ labels[this.state.intent].meetingSubjects }</label>
        <input type="text" value={this.state.meetingSubjects} onChange={this.updateMeetingSubjects} placeholder="Web literacy, 21st century skills, online privacy, social media, etc..."/>
      </fieldset>
      <fieldset>
        <label>Affiliated institution or oganization</label> (optional)
        <input type="text" value={this.state.affiliation} onChange={this.updateAffiliation} placeholder="Name of the school, library, organization, etc..."/>
      </fieldset>

      <fieldset>
        <input type="checkbox" checked={this.state.pledgeAgreement} onChange={this.updatePledgeAgreement}/> I agree to the Mozilla Club Captain Pledge
      </fieldset>
    </div>;
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

  generateReport() {
    var freq = this.state.frequency;
    if (freq === 'other') { freq = this.state.frequencyOther; }
    var age = this.state.ageRange.join(', ');
    if (this.state.ageRange.indexOf('other')) {
     age = age.replace('other', 'other: ' + this.state.ageRangeOther);
    }
    var report = [
      "reason to fill in the form: " + this.state.intent,
      "name for the club: " + this.state.clubName,
      "meeting venue: " + this.state.meetingVenue,
      "how frequent will the club meet: " + freq,
      "club participants age range: " + age,
      "club size: " + this.state.clubSize,
      "audience type: " + this.state.audienceType,
      "club topics: " + this.state.meetingSubjects
    ];
    if (this.state.affiliation) {
      report.push("affiliation: " + this.state.affilication);
    }
    return report;
  }
});

module.exports = StepTwo;
