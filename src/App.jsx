import Player from "./components/Player"
import Gameboard from "./components/Gameboard"
import { useState } from "react"
import Log from "./components/Log";
import {WINNING_COMBINATIONS} from "./Winning-combination.js"
import GameOver from "./components/GameOver.jsx";

const PLAYERS = {
  'X': 'Player 1',
  'O': 'Player 2'
}
const INITIAL_GAME_BOARD = [
  [null, null,null],
  [null, null,null],
  [null, null,null],
];

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
     currentPlayer = 'O';
  }
  return currentPlayer;

}

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];
  for(const turn of gameTurns){
      const {square,player} = turn;
      const {row,col} = square;

      gameBoard[row][col] = player;
  }
   return gameBoard;
}

function deriveWinner(gameBoard,players){
  let winner;

  for(const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquaresymbol  = gameBoard[combination[2].row][combination[2].column];
  
    if(firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol && 
      firstSquareSymbol === thirdSquaresymbol
    )
    {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {
  const [players,setPlayers] = useState(PLAYERS)
  const [gameTurns,setGameTurns] = useState([]);

const activePlayer = deriveActivePlayer(gameTurns);
const gameBoard = deriveGameBoard(gameTurns);


const winner = deriveWinner(gameBoard,players);

  function handleSelectedSquare(rowIndex,colIndex){
  
  setGameTurns((prevTurns) => {
    const currentPlayer = deriveActivePlayer(prevTurns);

    const updatedTurns = [
      {square:{row:rowIndex, col:colIndex}, player:currentPlayer},
      ...prevTurns
    ];
      return updatedTurns;
  });
  }

  const gameDraw = gameTurns.length === 9 && !winner;

  function handleRestart(){
    setGameTurns([]);
  }

  function handlePlayers(symbol,newPlayer){
    setPlayers(prevPlayer =>{
      return {
      ...prevPlayer,
       [symbol]:newPlayer
      }
        })
  }

  return (
    <>
     <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">

        <Player initialName ={PLAYERS.X}
         symbol ='X'
         isActive={activePlayer === "X"} 
         onChangeName = {handlePlayers} />

        <Player initialName ={PLAYERS.O} 
         symbol ='O'
         isActive={activePlayer === "O"}
         onChangeName = {handlePlayers} />
        </ol>
         {(winner ||gameDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <Gameboard onSelectSquare = {handleSelectedSquare} 
        board ={gameBoard} 
        />
      </div>
      <Log turns={gameTurns} />
     </main> 
    </>
  )
}

export default App
