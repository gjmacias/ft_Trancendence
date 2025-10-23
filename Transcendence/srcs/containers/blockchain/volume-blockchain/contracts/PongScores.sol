// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract PongScores {
    struct Game {
        uint256 id;
        string winner;
        string second;
        string rest;
        uint256 timestamp;
    }
    
    Game public gameResult;
    
    constructor(
        uint256 _id,
        string memory _winner,
        string memory _second,
        string memory _rest
    ) {
        gameResult = Game(_id, _winner, _second, _rest, block.timestamp);
    }
    
    function getGameResult() public view returns (
        uint256,
        string memory, 
        string memory, 
        string memory, 
        uint256
    ) {
        return (
            gameResult.id,
            gameResult.winner,
            gameResult.second,
            gameResult.rest,
            gameResult.timestamp
        );
    }

    function getId() public view returns (uint256) {
        return gameResult.id;
    }
    
    function getWinner() public view returns (string memory) {
        return gameResult.winner;
    }
    
    function getTimestamp() public view returns (uint256) {
        return gameResult.timestamp;
    }
}