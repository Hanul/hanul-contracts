// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IFarmReward.sol";
import "./interfaces/IFarmFactory.sol";

contract FarmReward is FungibleToken, IFarmReward {

    IFarmFactory public factory;
    
    constructor(
        string memory name,
        string memory symbol
    ) FungibleToken(name, symbol, "1") {
        factory = IFarmFactory(msg.sender);
    }

    modifier onlyFactory {
        require(msg.sender == address(factory));
        _;
    }

    function mint(address to, uint256 amount) onlyFactory external override {
        _mint(to, amount);
    }
}
