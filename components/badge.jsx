var React     = require('react'),
    classnames  = require('classnames'),
    ImageTag  = require('./imagetag.jsx');

var Badge = React.createClass({
  /**
   * returning the Status HTML
   * @param statusVal
   * @returns ReactElement
   */
  getStatus: function (statusVal) {

    if (statusVal === undefined) {
      return '';
    }
    else{
      statusVal = statusVal.toLowerCase();
    }

    var statusIcons = {
      available: 'fa-thumbs-up',
      pending : 'fa-clock-o',
      achieved: 'fa-check',
      eligible: 'fa-pencil',
      unclaimed: 'fa-check-circle',
      reserved: 'fa-exclamation-triangle'
    };

    var statusClasses = classnames('fa', 'fa-fw', statusIcons[statusVal]);
    var statusIcon = <i className={statusClasses} />;

    var classNames = 'label label-default ' + statusVal;

    return (
      <div className="status">
        <div className={classNames}>
          <span>{ statusIcon }</span>{statusVal}
        </div>
      </div>
    );

  },
  render: function () {
    var badge = this.props.badge;

    // FIXME:TODO: how is this even possible?
    if(!badge) return null;

    var title = badge.title,
        status = badge.status,
        icon = badge.icon,
        icon2x = badge.icon2x,
        status = badge.status;

    var statusElement = status ? this.getStatus(status) : null;

    return(
      <div className="badge-icon">
        <div className="image-container">
          <ImageTag src1x={icon} src2x={icon2x} alt={title} />
        </div>
        { statusElement }
      </div>
    )
  }
});

module.exports = Badge;
