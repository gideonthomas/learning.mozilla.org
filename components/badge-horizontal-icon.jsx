var React = require('react'),
  Badge = require('./badge.jsx');

var BadgeHorizontalIcon = React.createClass({
  propTypes: { badge: React.PropTypes.object.isRequired },

  /*
      icon={this.state.badge.icon}
      icon2x={this.state.badge.icon2x}
      title={this.state.badge.title}
      status={this.state.badge.status}
      alt={this.state.badge.title}
      description={this.state.badge.description}

      <div className="text-uppercase">21st century skills</div>
      <h2 className="title">{this.state.badge.title}</h2>
      <div className="description">{this.state.badge.description}</div>

    </BadgeHorizontalIcon>
   */

  render: function() {
    return (
      <div className='badge-details'>
        <Badge badge={this.props.badge} />

        <h2>{ this.props.badge.title }</h2>
        <div>{ this.props.badge.description }</div>
      </div>
    )
  }
});

module.exports = BadgeHorizontalIcon;
