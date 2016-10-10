var React =require('react');

// import './Announcement.css';

var Announcement =React.createClass({
  render(){
    return(
    <div className={this.props.winner ? 'visible':'hidden'}>
      <h2>Game over</h2>
      <p>{this.props.winner}</p>
       
    </div>
    )
  }
});

module.exports =Announcement;