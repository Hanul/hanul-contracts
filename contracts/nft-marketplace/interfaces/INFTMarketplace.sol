// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/INonFungibleToken.sol";

interface INFTMarketplace {

    event Sell(INonFungibleToken indexed token, uint256 indexed nftId, address indexed owner, uint256 price);
    event Buy(INonFungibleToken indexed token, uint256 indexed nftId, address indexed buyer);
    event CancelSale(INonFungibleToken indexed token, uint256 indexed nftId, address indexed owner);

    event Offer(INonFungibleToken indexed token, uint256 indexed nftId, uint256 indexed offerId, address offeror, uint256 price);
    event CancelOffer(INonFungibleToken indexed token, uint256 indexed nftId, uint256 indexed offerId, address offeror);
    event AcceptOffer(INonFungibleToken indexed token, uint256 indexed nftId, uint256 indexed offerId, address acceptor);

    event Auction(INonFungibleToken indexed token, uint256 indexed nftId, address indexed owner, uint256 startPrice, uint256 endBlock);
    event CancelAuction(INonFungibleToken indexed token, uint256 indexed nftId, address indexed owner);
    event Bid(INonFungibleToken indexed token, uint256 indexed nftId, address indexed bidder, uint256 price);
    event Claim(INonFungibleToken indexed token, uint256 indexed nftId, address indexed bidder, uint256 price);
    
    function sell(INonFungibleToken token, uint256 nftId, uint256 price) external;
    function checkSelling(INonFungibleToken token, uint256 nftId) external returns (bool);
    function buy(INonFungibleToken token, uint256 nftId) payable external;
    function cancelSale(INonFungibleToken token, uint256 nftId) external;

    function offer(INonFungibleToken token, uint256 nftId) payable external returns (uint256 offerId);
    function cancelOffer(INonFungibleToken token, uint256 nftId, uint256 offerId) external;
    function acceptOffer(INonFungibleToken token, uint256 nftId, uint256 offerId) external;

    function auction(INonFungibleToken token, uint256 nftId, uint256 startPrice, uint256 endBlock) external;
    function cancelAuction(INonFungibleToken token, uint256 nftId) external;
    function checkAuction(INonFungibleToken token, uint256 nftId) external returns (bool);
    function bid(INonFungibleToken token, uint256 nftId) payable external returns (uint256 biddingId);
    function claim(INonFungibleToken token, uint256 nftId) external;
}
