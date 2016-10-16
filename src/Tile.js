var  React =require('react');
// import './Tile.css';

var Tile= React.createClass({

  titleClick(props) {
    props.updateBoard(props.loc);
  },

  render() {
    return (
      <div className={"tile "+this.props.loc}
           onClick={()=> this.titleClick(this.props)}>
        {this.props.value}
      </div>
    )
  }
});
module.exports =Tile;