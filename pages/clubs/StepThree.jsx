var React = require('react');
var ReactDOM = require('react-dom');
var Divider = require('../../components/Divider.jsx');

var StepThree = React.createClass({
  render: function() {
    var className = "step3" + (this.props.hidden ? " hidden" : "");
    return (
      <div className={className}>
        <div className="arrowdown"/>
        <p>To learn more about Mozilla Clubs, read the Fact Sheet</p>
        <Divider/>
        <button className="btn" onClick={this.props.onClick}>click for a fake reportout!</button>
      </div>
    );
  }
});

module.exports = StepThree;
