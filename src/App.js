var React = require('react');
// import './App.css';
var Announcement = require('./Announcement');

var ResetButton = require('./ResetButton');
var Tile = require('./Tile');

var io = require('socket.io-client');
import * as audio from './audio';


// let socket = io('http://localhost:3000');
var room = 'ab11';

var App = React.createClass({
    getInitialState() {
        return {
            gameBoard: [
                ' ', ' ', ' ',
                ' ', ' ', ' ',
                ' ', ' ', ' '
            ],
            turn: 'x',
            isYourTurn: true,
            winner: null,
            message: "none",
            isGameStarted: false,
            room: null,
            route: window.location.hash.substr(2),
            isGameOver: false
        };
        /*
         socket.on('change state', data=> {
         this.setState({data});
         })*/
    },
    /*componentDidMount(){
     window.addEventListener('hashchange',()=>{
     this.setState({
     route:window.location.hash.substr(1)
     })
     })
     }*/

    componentWillMount(){
        // this.socket = io('http://localhost:3000');
        this.socket = io();
        this.socket.on('connect', this.joinRoom);
        this.socket.on('joined the room', this.joinedRoom);

        this.socket.on('change state', this.updateState);
        this.socket.on('wow', this.showMsg);
        this.socket.on('start game', this.startGame);
    },
    joinRoom(){
        this.socket.emit('room',
            (this.state.route == '') ? (this.getRandomNumber()) : this.state.route);
        },
    joinedRoom(room){
        this.setState({room: room})
    },

    getRandomNumber(){
        return Math.floor(Math.random() * (1000));
    },
    startGame(){
        (window.location.hash == "") ? window.location.hash = "/" + this.state.room : true;
        this.setState({isGameStarted: true})
    },
    showMsg(message){
        this.setState({message: message});
    },

    updateState(data){
        this.setState(data);
    },

    updateBoard(loc, player) {
        let winner = false;
        if (!this.state.isYourTurn) {
            return;
        }
        if (this.state.gameBoard[loc] === 'x' || this.state.gameBoard[loc] === 'o'
            || this.state.winner) {
            return;
        }
        let currentGameBoard = this.state.gameBoard;
        currentGameBoard.splice(loc, 1, this.state.turn);


        let topRow = this.state.gameBoard[0] + this.state.gameBoard[1] + this.state.gameBoard[2];
        if (topRow.match(/xxx|ooo/)) {
            winner=true;
        }
        let middleRow = this.state.gameBoard[3] + this.state.gameBoard[4] + this.state.gameBoard[5];
        if (middleRow.match(/xxx|ooo/)) {
            winner=true;
        }
        let bottomRow = this.state.gameBoard[6] + this.state.gameBoard[7] + this.state.gameBoard[8];
        if (bottomRow.match(/xxx|ooo/)) {
            winner=true;
        }
        let leftCol = this.state.gameBoard[0] + this.state.gameBoard[3] + this.state.gameBoard[6];
        if (leftCol.match(/xxx|ooo/)) {
            winner=true;
        }
        let middleCol = this.state.gameBoard[1] + this.state.gameBoard[4] + this.state.gameBoard[7];
        if (middleCol.match(/xxx|ooo/)) {
            winner=true;
        }
        let rightCol = this.state.gameBoard[2] + this.state.gameBoard[5] + this.state.gameBoard[8];
        if (rightCol.match(/xxx|ooo/)) {
            winner=true;
        }
        let leftDiag = this.state.gameBoard[0] + this.state.gameBoard[4] + this.state.gameBoard[8];
        if (leftDiag.match(/xxx|ooo/)) {
            winner=true;
        }
        let rigthDiag = this.state.gameBoard[2] + this.state.gameBoard[4] + this.state.gameBoard[6];
        if (rigthDiag.match(/xxx|ooo/)) {
            winner=true;
        }

        let moves = this.state.gameBoard.join('').replace(/ /g, '');
        if (moves.length == 9) {
            this.updateState({
                winner: 'd',
            });
        }

        let turnSound = this.state.turn == 'x' ? 'cross' : 'circle';
        audio.loop = false;
        audio.play(turnSound);

        this.updateState({
            gameBoard: currentGameBoard,
            isYourTurn: false,
            turn: (this.state.turn === 'x') ? 'o' : 'x',
            isGameOver: winner,
            winner:winner?this.state.turn:null
        });

        // send by socket to enemy
        this.socket.emit('update state', {
            gameBoard: currentGameBoard,
            isYourTurn: true,
            turn: (this.state.turn === 'x') ? 'o' : 'x',
            room: this.state.room,
            isGameOver:winner,
            winner:winner?this.state.turn:null
        });
    },


    resetBoard() {
        this.setState({
            gameBoard: [
                ' ', ' ', ' ',
                ' ', ' ', ' ',
                ' ', ' ', ' '
            ],
            turn: 'x',
            winner: null
        })
    },

    render() {
        return (
            <div className="container ">
                <div className="menu">
                    <h1>Tic tac toe</h1>
                   <h2>{this.state.isGameOver? "The game is over" : "Make your move"}</h2>
                    <Announcement winner={this.state.winner} areYouWinner={!this.state.isYourTurn}/>
                    {/*<ResetButton reset={this.resetBoard}/>*/}
                </div>
                <div>

                </div>
                <div>
                    {this.state.isGameStarted ?
                        this.state.gameBoard.map(function (value, index) {
                            return (<Tile
                                    key={index}
                                    loc={index}
                                    value={value}
                                    updateBoard={this.updateBoard}
                                    turn={this.state.turn}
                                />
                            )
                        }.bind(this))
                        :
                        <div>
                            <h2>"Wait till someone connect"</h2>
                            <p>{window.location + "#/" + this.state.room}</p>
                        </div>
                    }
                </div>
            </div>
        );
    }
});

module.exports = App;