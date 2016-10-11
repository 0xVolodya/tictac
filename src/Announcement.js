var React =require('react');

// import './Announcement.css';

var Announcement =React.createClass({
  render(){
    return(
    <div className={this.props.winner ? 'visible':'hidden'}>
      {(this.props.areYouWinner) ?
          <p>You win</p>:
          <p>You lost</p>
      }
    </div>
    )
  }
});

module.exports =Announcement;