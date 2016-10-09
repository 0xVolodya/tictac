import React from 'react';
import './Tile.css';


export default class Tile extends React.Component {

  titleClick(props) {
    props.updateBoard(props.loc, props.turn);
  }

  render() {
    return (
      <div className={"tile "+this.props.loc}
           onClick={()=> this.titleClick(this.props)}>
        {this.props.value}
      </div>
    )
  }
}