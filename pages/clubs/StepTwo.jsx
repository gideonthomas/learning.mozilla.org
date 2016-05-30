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

var progressFields = [
  "intent",
  "clubName",
  "meetingVenue",
  "frequency",
  "ageRange",
  "clubSize",
  "audienceType",
  "meetingSubjects",
  "pledgeAgreement"
]

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
    return progressFields.length;
  },

  getFilled: function() {
    var state = this.state;
    var optional = this.optional;
    return progressFields.reduce(function(a,b) {
      b = state[b];
      b = b===null? 0 : b===false? 0 : b.length===0 ? 0 : optional.indexOf(b)>-1 ? 0 : 1;
      return a + b;
    }, 0);
  },

  setStateAsChange(state) {
    this.setState(state, function() {
      this.props.onChange();
      if (this.state.errors && this.state.errors.length>0) {
        this.validates();
      }
    });
  },

  render: function() {
    var className = "step2" + (this.props.hidden ? " hidden" : "");
    return (
      <div className={className}>
        <fieldset>
          <label>Do you want to...</label>
          <div className="choiceGroup">
            <div><input type="radio" name="intent" value="start" checked={this.state.intent === 'start'} onChange={this.updateIntent}/> Start a club</div>
            <div className="autowidth"><input type="radio" name="intent" value="integrate" checked={this.state.intent === 'integrate'} onChange={this.updateIntent}/> Integrate a Mozilla Club with your existing program</div>
          </div>
        </fieldset>

        { this.generateRest() }
      </div>
    );
  },

  generateRest: function() {
    if (!this.state.intent) {
      return this.renderValidationErrors();
    }

    return <div>
      <fieldset>
        <label>{ labels[this.state.intent].clubName }</label>
        <input type="text" value={this.state.clubName} onChange={this.updateClubName} placeholder=""/>
      </fieldset>

      <fieldset>
        <label>{ labels[this.state.intent].meetingVenue }</label>
        <input type="text" value={this.state.meetingVenue} onChange={this.updateMeetingVenue} placeholder="Name the venue, school, library, coffeeshop, university, etc..."/>
      </fieldset>

      <fieldset>
        <label>{ labels[this.state.intent].frequency }</label>
        <div className="choiceGroup">
          <div className="col">
            <div><input type="radio" name="frequency" value="weekly" checked={this.state.frequency === 'weekly'} onChange={this.updateFrequency}/> Once a week</div>
            <div><input type="radio" name="frequency" value="biweekly" checked={this.state.frequency === 'biweekly'} onChange={this.updateFrequency}/> Every other week</div>
          </div>
          <div className="col">
            <div><input type="radio" name="frequency" value="monthly" checked={this.state.frequency === 'monthly'} onChange={this.updateFrequency}/> Once a month</div>
            <div><input type="radio" name="frequency" value="other" checked={this.state.frequency === 'other'} onChange={this.updateFrequency}/> Other</div>
          </div>
        </div>
        <input type="text"  hidden={this.state.frequency !== 'other'} value={this.state.frequencyOther} placeholder='If "other", please explain' onChange={this.updateFrequencyOther}/>
      </fieldset>

      <fieldset>
        <label>{ labels[this.state.intent].ageRange }</label>
        <div className="choiceGroup">
          <div className="col">
            <div><input type="checkbox" value="12-"   checked={this.state.ageRange.indexOf("12-"  ) > -1} onChange={this.updateAgeRange}/> Under 12 years old</div>
            <div><input type="checkbox" value="12-20" checked={this.state.ageRange.indexOf("12-20") > -1} onChange={this.updateAgeRange}/> 12-20 years old</div>
          </div>
          <div className="col">
            <div><input type="checkbox" value="21-35" checked={this.state.ageRange.indexOf("21-35") > -1} onChange={this.updateAgeRange}/> 21-35 years old</div>
            <div><input type="checkbox" value="36-60" checked={this.state.ageRange.indexOf("36-60") > -1} onChange={this.updateAgeRange}/> 35-60 years old</div>
          </div>
          <div className="col">
            <div><input type="checkbox" value="61+"   checked={this.state.ageRange.indexOf("61+"  ) > -1} onChange={this.updateAgeRange}/> 61 years or older</div>
            <div><input type="checkbox" value="other" checked={this.state.ageRange.indexOf("other") > -1} onChange={this.updateAgeRange}/> other</div>
          </div>
        </div>
        <input type="text" hidden={this.state.ageRange.indexOf("other") === -1} value={this.state.ageRangeOther} placeholder='if "other", please explain' onChange={this.updateAgeRangeOther}/>
      </fieldset>

      <fieldset>
        <label>{ labels[this.state.intent].clubSize }</label>
        <div className="choiceGroup">
          <div className="col">
            <div><input type="radio" name="clubSize" value="1-5"   checked={this.state.clubSize === '1-5'} onChange={this.updateClubSize}/> 1-5 members</div>
            <div><input type="radio" name="clubSize" value="6-15"  checked={this.state.clubSize === '6-15'} onChange={this.updateClubSize}/> 6-15 members</div>
          </div>
          <div className="col">
            <div><input type="radio" name="clubSize" value="16-30" checked={this.state.clubSize === '16-30'} onChange={this.updateClubSize}/> 16-30 members</div>
            <div><input type="radio" name="clubSize" value="31+"   checked={this.state.clubSize === '31+'} onChange={this.updateClubSize}/> 31 or more members</div>
          </div>
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
        <div className="pledge"><input type="checkbox" checked={this.state.pledgeAgreement} onChange={this.updatePledgeAgreement}/> I agree to the <a href="http://soapdog.github.io/your-first-month-as-a-club-captain-guide/#mozilla-club-captain-pledge">Mozilla Club Captain Pledge</a>.</div>
      </fieldset>

      { this.renderValidationErrors() }
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


  validates: function() {
    var clubState = this.state;
    var errorElements = [];
    var errors = [];

    if (!clubState.intent) {
      errorElements.push('intent');
      errors.push("You need to fill in this part of the application.");
    }
    else {
      if (!clubState.clubName) {
        errorElements.push('clubName');
        errors.push("You need to fill in the name of your club.");
      }
      if (!clubState.meetingVenue) {
        errorElements.push('meetingVenue');
        errors.push("Please let us know where your club meets.");
      }
      if (!clubState.frequency) {
        errorElements.push('frequency');
        errors.push("Please let us know how often you (will) meet.");
      }
      if (!clubState.ageRange) {
        errorElements.push('ageRange');
        errors.push("Please let us know what kind of age your audience has.");
      }
      if (!clubState.clubSize) {
        errorElements.push('clubSize');
        errors.push("Please let us know how big your club is.");
      }
      if (!clubState.audienceType) {
        errorElements.push('audienceType');
        errors.push("Please let us know what kind of audience your club is for.");
      }
      if (!clubState.meetingSubjects) {
        errorElements.push('meetingSubjects');
        errors.push("Please let us know what topics and subjects your club covers.");
      }
      if (!clubState.pledgeAgreement) {
        errorElements.push('clubName');
        errors.push("You must agree to the Club Captain Pledge before you can submit this application.");
      }
    }

    this.setState({ errors: errors, errorElements: errorElements });
    return !errors.length;
  },

  error: function(field) {
    if (!this.state.errorElements) return null;
    var error = this.state.errorElements.indexOf(field) > -1;
    return error ? "error" : null;
  },

  renderValidationErrors: function() {
    if (!this.state.errors || this.state.errors.length === 0) return null;
    return (
      <div className="alert alert-danger">
        <p>Unfortunately, your application has some problems:</p>
        <ul>
        {this.state.errors.map(function(text,i) {
          return <li key={i}>{text}</li>;
        })}
        </ul>
      </div>
    );
  },

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
      "club meeting frequency: " + freq,
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
