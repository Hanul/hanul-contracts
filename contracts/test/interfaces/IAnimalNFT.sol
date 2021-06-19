// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/INonFungibleToken.sol";

interface IAnimalNFT is INonFungibleToken {

    function mint(string memory name) external returns (uint256 id);
}
