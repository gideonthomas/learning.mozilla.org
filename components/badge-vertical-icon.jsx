var React = require('react'),
    Badge = require('./badge.jsx');

var BadgeVerticalIcon = React.createClass({
  render: function() {
    var badge = this.props.badge;
    return (
      <div className='badge-vertical-icon'>
        <Badge badge={badge}/>
        <div className="badge-text text-center">
          <div className="title">{badge.title}</div>
          <div className="description">{badge.description}</div>
        </div>
      </div>
    )
  }
});

module.exports = BadgeVerticalIcon;
