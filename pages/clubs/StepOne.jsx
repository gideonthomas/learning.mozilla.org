var React = require('react');
var ReactDOM = require('react-dom');
var LocationSelector = require('../../components/LocationSelector.jsx');
var Select = require('react-select');

var StepOne = React.createClass({
  getInitialState: function() {
    this.optional = [];
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
    var props = this.props;
    this.setState(state, function() {
      props.onChange();
    });
  },

  render: function() {
    var className = "step1" + (this.props.hidden ? " hidden" : "");
    return (
      <div className={className}>
        <fieldset>
          <label>Name</label>
          <input type="text" value={this.state.name} onChange={this.updateName} placeholder="Your full name"/>
        </fieldset>
        <fieldset>
          <label>Location</label>
          <LocationSelector onChange={this.updateLocation} placeholder="City, Country"/>
        </fieldset>
        <fieldset>
          <label>Occupation</label>
          <input type="text" value={this.state.occupation} onChange={this.updateOccupation} placeholder="Student or professional at ..."/>
        </fieldset>
        <fieldset>
          <label>Are you currently working with a Regional Coordinator?</label>
          <div className="choiceGroup">
            <div><input type="radio" name="regionalCoordinator" value="yes" checked={this.state.regionalCoordinator === 'yes'} onChange={this.updateRegionalCoordinator}/> Yes</div>
            <div><input type="radio" name="regionalCoordinator" value="no" checked={this.state.regionalCoordinator === 'no'} onChange={this.updateRegionalCoordinator}/> No</div>
          </div>
          <div hidden={this.state.regionalCoordinator !== 'yes'}>
            <label>What is your Regional Coordinator{"'"}s name?</label>
            <input type="text" value={this.state.coordinatorName} placeholder='name' onChange={this.updateCoordinatorName}/>
          </div>
        </fieldset>
        <fieldset>
          <label>Why do you want to host a Mozilla Club?</label>
          <textarea value={this.state.hostReason} onChange={this.updateHostReason} placeholder="Describe what you want to achieve and what your goals are. Minimum length 100 words."/>
        </fieldset>
        <fieldset>
          <label>How did you hear about Mozilla Clubs?</label>
          <Select
            value={this.state.howDidYouHear}
            options={[
              { value: 'from a friend', label: 'from a friend' },
              { value: 'from an event', label: 'from an event' },
              { value: 'Mozilla website', label: 'Mozilla website' },
              { value: 'Social media', label: 'Social media' },
              { value: 'other', label: 'other' }
            ]}
            onChange={this.updateHowDidYouHear}
          />
          <input hidden={this.state.howDidYouHear !== 'other'} type="text" value={this.state.howDidYouActuallyHear} onChange={this.updateHowDidYouActuallyHear} placeholder="Let us know how  you heard about becoming a club captain"/>
        </fieldset>
      </div>
    );
  },
  updateName: function(evt) { this.setStateAsChange({ name: evt.target.value }); },
  updateLocation: function(locationdata) {
    try { locationdata = JSON.parse(locationdata); }
    catch (e) { locationdata = { location: null, latitude: null, longitude: null }; }
    this.setStateAsChange({ location: locationdata.location });
  },
  updateOccupation: function(evt) { this.setStateAsChange({ occupation: evt.target.value }); },
  updateRegionalCoordinator: function(evt) { this.setStateAsChange({ regionalCoordinator: evt.target.value }); },
  updateCoordinatorName: function(evt) { this.setStateAsChange({ coordinatorName: evt.target.value }); },
  updateHostReason: function(evt) { this.setStateAsChange({ hostReason: evt.target.value }); },
  updateHowDidYouHear: function(value) { this.setStateAsChange({ howDidYouHear: value }); },
  updateHowDidYouActuallyHear: function(evt) { this.setStateAsChange({ howDidYouActuallyHear: evt.target.value }); },

  generateReport() {
    var report = [
      "applicant name: " + this.state.name,
      "club location: " + this.state.location,
      "applicant occupation: " + this.state.occupation,
      "do they have a regional coordinator? " + this.state.regionalCoordinator
    ];

    if (this.state.coordinatorName) {
      report.push("regional coordinator name: " + this.state.coordinatorName);
    }

    report.push("reason for hosting a club: " + this.state.hostReason);

    var how = this.state.howDidYouHear;
    if (how === "other") { how = this.state.howDidYouActuallyHear; }
    report.push("how they heard about moz clubs: " + how);

    return report;
  }
});

module.exports = StepOne;
