var React = require('react');
var ReactDOM = require('react-dom');

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
          <input type="text" value={this.state.location} onChange={this.updateLocation} placeholder="City, Country"/>
        </fieldset>
        <fieldset>
          <label>Occupation</label>
          <input type="text" value={this.state.occupation} onChange={this.updateOccupation} placeholder="Student or professional at ..."/>
        </fieldset>
        <fieldset>
          <label>Are you currently working with a Regional Coordinator?</label>
          <span>
            <input type="radio" name="regionalCoordinator" value="yes" checked={this.state.regionalCoordinator === 'yes'} onChange={this.updateRegionalCoordinator}/>
            <span>Yes</span>
          </span>
          <span>
            <input type="radio" name="regionalCoordinator" value="no" checked={this.state.regionalCoordinator === 'no'} onChange={this.updateRegionalCoordinator}/>
            <span>No</span>
          </span>
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
  updateHowDidYouHear: function(evt) { this.setStateAsChange({ howDidYouHear: evt.target.value }); },

  generateReport() {
    return [
      "applicant name: " + this.state.name,
      "club location: " + this.state.location,
      "applicant occupation: " + this.state.occupation,
      "are they a regional coordinator? " + this.state.regionalCoordinator,
      "reason for hosting a club: " + this.state.hostReason,
      "how they heard about moz clubs: " + this.state.howDidYouHear
    ];
  }
});

module.exports = StepOne;
