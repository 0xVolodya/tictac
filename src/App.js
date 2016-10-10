var React = require('react');
// import './App.css';
var Announcement = require('./Announcement');

var ResetButton = require('./ResetButton');
var Tile = require('./Tile');

var io = require('socket.io-client');
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
            winner: null,
            message: "none",
            isGameStarted: false,
            room:null
        };
        /*
         socket.on('change state', data=> {
         this.setState({data});
         })*/
    },
    componentWillMount(){
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.joinRoom);
        this.socket.on('change state', this.updateState);
        this.socket.on('wow', this.showMsg);
        this.socket.on('start game', this.startGame);
    },
    joinRoom(){
        this.socket.emit('room', this.getRandomNumber());
    },
    getRandomNumber(){
        return Math.random() * (1000-0) + 0;
    },
    startGame(){
        this.setState({isGameStarted: true})
    },
    showMsg(message){
        this.setState({message: message});
    },

    updateState(data){
        this.setState(data);
    },

    updateBoard(loc, player) {
        if (this.state.gameBoard[loc] === 'x' || this.state.gameBoard[loc] === 'o'
            || this.state.winner) {
            return;
        }
        let currentGameBoard = this.state.gameBoard;
        currentGameBoard.splice(loc, 1, this.state.turn);


        let topRow = this.state.gameBoard[0] + this.state.gameBoard[1] + this.state.gameBoard[2];
        if (topRow.match(/xxx|ooo/)) {
            this.setState({
                winner: player
            });
            return;
        }
        let middleRow = this.state.gameBoard[3] + this.state.gameBoard[4] + this.state.gameBoard[5];
        if (middleRow.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }
        let bottomRow = this.state.gameBoard[6] + this.state.gameBoard[7] + this.state.gameBoard[8];
        if (bottomRow.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }
        let leftCol = this.state.gameBoard[0] + this.state.gameBoard[3] + this.state.gameBoard[6];
        if (leftCol.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }
        let middleCol = this.state.gameBoard[1] + this.state.gameBoard[4] + this.state.gameBoard[7];
        if (middleCol.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }
        let rightCol = this.state.gameBoard[2] + this.state.gameBoard[5] + this.state.gameBoard[8];
        if (rightCol.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }
        let leftDiag = this.state.gameBoard[0] + this.state.gameBoard[4] + this.state.gameBoard[8];
        if (leftDiag.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }
        let rigthDiag = this.state.gameBoard[2] + this.state.gameBoard[4] + this.state.gameBoard[6];
        if (rigthDiag.match(/xxx|ooo/)) {
            this.setState({
                winner: this.state.turn
            });
            return;
        }

        let moves = this.state.gameBoard.join('').replace(/ /g, '');
        if (moves.length == 9) {
            this.setState({
                winner: 'd'
            });
        }

        this.setState({
            gameBoard: currentGameBoard,
            turn: (this.state.turn === 'x') ? 'o' : 'x'
        });

        // send by socket to all
        this.socket.emit('update state', {
            gameBoard: currentGameBoard,
            turn: (this.state.turn === 'x') ? 'o' : 'x'
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
                    <h1>{this.state.message}</h1>
                    <Announcement winner={this.state.winner}/>
                    <ResetButton reset={this.resetBoard}/>

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
                        : "Wait till someone connect"

                    }
                </div>
            </div>
        );
    }
});

module.exports = App;