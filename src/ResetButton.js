var React =require('react');

var ResetButton =React.createClass({
  render() {
    return (
      <button onClick={this.props.reset}>
        Reset
      </button>
    )
  }
});

module.exports=ResetButton;