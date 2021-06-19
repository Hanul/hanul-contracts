// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/IRNG.sol";

contract RNG is IRNG {

    uint256 private nonce = 0;
    
    function generateRandomNumber(uint256 seed) external override returns (uint256) {
        nonce += 1;
        return uint256(keccak256(abi.encodePacked(nonce, msg.sender, block.timestamp, seed, block.difficulty, blockhash(block.number - 1))));
    }
}
