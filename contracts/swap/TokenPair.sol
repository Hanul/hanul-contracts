// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "../token/interfaces/IFungibleToken.sol";
import "./interfaces/ITokenPair.sol";

contract TokenPair is FungibleToken, ITokenPair {

    address public swaper;
    IFungibleToken public token0;
    IFungibleToken public token1;

    constructor(
        string memory id,
        IFungibleToken _token0,
        IFungibleToken _token1
    ) FungibleToken(
        string(abi.encodePacked("TokenPair #", id)),
        string(abi.encodePacked("PAIR-", id)),
        "1"
    ) {
        swaper = msg.sender;
        token0 = _token0;
        token1 = _token1;
    }
}
