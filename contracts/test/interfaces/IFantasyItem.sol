// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IItem.sol";

interface IFantasyItem is IItem {

    function mint(uint256 id, uint256 amount) external;
    function burn(uint256 id, uint256 amount) external;
}
