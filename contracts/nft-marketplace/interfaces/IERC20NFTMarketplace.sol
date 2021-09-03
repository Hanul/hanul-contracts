// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";
import "../../token/interfaces/INonFungibleToken.sol";

interface IERC20NFTMarketplace {

    event Sell(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed owner, uint256 price);
    event Buy(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed buyer, uint256 price);
    event CancelSale(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed owner);

    event Offer(INonFungibleToken indexed nft, uint256 indexed nftId, uint256 indexed offerId, address offeror, uint256 price);
    event CancelOffer(INonFungibleToken indexed nft, uint256 indexed nftId, uint256 indexed offerId, address offeror);
    event AcceptOffer(INonFungibleToken indexed nft, uint256 indexed nftId, uint256 indexed offerId, address acceptor);

    event Auction(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed owner, uint256 startPrice, uint256 endBlock);
    event CancelAuction(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed owner);
    event Bid(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed bidder, uint256 price);
    event Claim(INonFungibleToken indexed nft, uint256 indexed nftId, address indexed bidder, uint256 price);
    
    function token() external returns (IFungibleToken);

    function sell(INonFungibleToken nft, uint256 nftId, uint256 price) external;
    function sellWithPermit(INonFungibleToken nft, uint256 nftId, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function checkSelling(INonFungibleToken nft, uint256 nftId) external returns (bool);
    function buy(INonFungibleToken nft, uint256 nftId) external;
    function buyWithPermit(INonFungibleToken nft, uint256 nftId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
    function cancelSale(INonFungibleToken nft, uint256 nftId) external;

    function offer(INonFungibleToken nft, uint256 nftId, uint256 price) external returns (uint256 offerId);
    function offerWithPermit(INonFungibleToken nft, uint256 nftId, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 offerId);
    function cancelOffer(INonFungibleToken nft, uint256 nftId, uint256 offerId) external;
    function acceptOffer(INonFungibleToken nft, uint256 nftId, uint256 offerId) external;

    function auction(INonFungibleToken nft, uint256 nftId, uint256 startPrice, uint256 endBlock) external;
    function auctionWithPermit(INonFungibleToken nft, uint256 nftId, uint256 startPrice, uint256 endBlock,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function cancelAuction(INonFungibleToken nft, uint256 nftId) external;
    function checkAuction(INonFungibleToken nft, uint256 nftId) external returns (bool);
    function bid(INonFungibleToken nft, uint256 nftId, uint256 price) external returns (uint256 biddingId);
    function bidWithPermit(INonFungibleToken nft, uint256 nftId, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 biddingId);
    function claim(INonFungibleToken nft, uint256 nftId) external;
}
