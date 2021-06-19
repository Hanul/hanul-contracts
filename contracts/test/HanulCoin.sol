// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IHanulCoin.sol";

contract HanulCoin is FungibleToken, IHanulCoin {

    uint256 public constant override INITIAL_SUPPLY = 1988 * 1e18;

    constructor() FungibleToken("HanulCoin", "HANUL", "1") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(uint256 amount) external override {
        _mint(msg.sender, amount);
    }

    function burn(uint256 amount) external override {
        _burn(msg.sender, amount);
    }
}
