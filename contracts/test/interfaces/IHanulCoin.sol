// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface IHanulCoin is IFungibleToken {

    function INITIAL_SUPPLY() external view returns (uint256);

    function mint(uint256 amount) external;
    function burn(uint256 amount) external;
}
