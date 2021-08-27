// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/INonFungibleToken.sol";

interface INFTMarketplace {

    function sell(INonFungibleToken token, uint256 nftId, uint256 price) external;
    function buy(INonFungibleToken token, uint256 nftId) payable external;

    function offer(INonFungibleToken token, uint256 nftId) payable external;
    function cancelOffer(INonFungibleToken token, uint256 nftId) external;
    function acceptOffer(INonFungibleToken token, uint256 nftId) external;

    function startAuction(INonFungibleToken token, uint256 nftId, uint256 startPrice, uint256 duration) external;
    function bid(INonFungibleToken token, uint256 nftId) payable external;
    function cancelBid(INonFungibleToken token, uint256 nftId) external;
    function claim(INonFungibleToken token, uint256 nftId) external;
}
