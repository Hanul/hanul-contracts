// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IFarmToken.sol";

contract FarmToken is FungibleToken, IFarmToken {
    
    constructor() FungibleToken("FarmToken", "FARM", "1") {
    }
}
