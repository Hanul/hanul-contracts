/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "../token/interfaces/IFungibleToken.sol";
import "./interfaces/ITokenPair.sol";
import "./interfaces/ISwaper.sol";

contract TokenPair is FungibleToken, ITokenPair {

    ISwaper public swaper;
    IFungibleToken public token1;
    IFungibleToken public token2;

    constructor(
        string memory id,
        IFungibleToken _token1,
        IFungibleToken _token2
    ) FungibleToken(
        string(abi.encodePacked("TokenPair #", id)),
        string(abi.encodePacked("PAIR-", id)),
        "1"
    ) {
        swaper = ISwaper(msg.sender);
        token1 = _token1;
        token2 = _token2;
    }
}
*/