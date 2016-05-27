var React = require('react');
var ReactDOM = require('react-dom');

var ProgressBar = function(props) {
  var st = {
    display: 'inline-block',
    height: '10px',
    background: 'transparent',
    border: '1px solid grey',
    borderRadius: '5px'
  };
  var cr = {
    height: '10px',
    width: Math.min(100, props.value) + '%',
    background: 'lightblue',
    borderRadius: '5px'
  };
  return <div className="progressBar" style={{textAlign: 'center'}}>
    <div className="outer" style={st}><div className="inner" style={cr}/></div> {props.value}%
  </div>;
};

module.exports = ProgressBar;
