// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../rng/RNG.sol";

contract RNGTest {

    RNG private rng;

    constructor(address rngAddr) {
        rng = RNG(rngAddr);
    }

    uint256 public number = 0;
    
    function generate(uint256 seed) external returns (uint256) {
        number = rng.generateRandomNumber(seed);
        return number;
    }
}
