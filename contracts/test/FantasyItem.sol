// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/Item.sol";
import "./interfaces/IFantasyItem.sol";

contract FantasyItem is Item, IFantasyItem {

    constructor() Item("FantasyItem", "https://thefantasygame.org/api/fantasyitem/{id}.json", "1") {}

    function mint(uint256 id, uint256 amount) external override {
        _mint(msg.sender, id, amount, "");
    }

    function burn(uint256 id, uint256 amount) external override {
        _burn(msg.sender, id, amount);
    }
}
