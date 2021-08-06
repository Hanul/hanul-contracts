// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface IFarmReward is IFungibleToken {
    function mint(address to, uint256 amount) external;
}
