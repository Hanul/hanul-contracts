// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IEmittableToken.sol";
import "./interfaces/IEmitter.sol";

contract EmittableToken is FungibleToken, IEmittableToken {

    IEmitter public emitter;
    
    constructor(
        string memory name,
        string memory symbol
    ) FungibleToken(name, symbol, "1") {
        emitter = IEmitter(msg.sender);
    }

    modifier onlyEmitter {
        require(msg.sender == address(emitter));
        _;
    }

    function mint(address to, uint256 amount) onlyEmitter external override {
        _mint(to, amount);
    }
}
