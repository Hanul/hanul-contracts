// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/NonFungibleToken.sol";
import "./interfaces/IAnimalNFT.sol";

contract AnimalNFT is NonFungibleToken, IAnimalNFT {

    struct Animal {
        string name;
    }
    Animal[] public animals;

    constructor() NonFungibleToken("AnimalNFT", "ANIMAL", "1") {}

    function mint(string memory name) external override returns (uint256 id) {
        id = animals.length;

        animals.push(
            Animal({
                name: name
            })
        );

        _mint(msg.sender, id);
    }
}
