// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC20NFTMarketplace.sol";

contract ERC20NFTMarketplace is Ownable, IERC20NFTMarketplace {

    IFungibleToken override public token;

    constructor(IFungibleToken _token) {
        token = _token;
    }

    uint256 public ownerFee = 25 * 1e4 / 1000;

    function setOwnerFee(uint256 fee) onlyOwner external {
        ownerFee = fee;
    }
    
    struct NFTDeployer {
        address deployer;
        uint256 fee; // 1e4
    }
    mapping(INonFungibleToken => NFTDeployer) public nftDeployers;

    function setNFTDeployer(INonFungibleToken nft, address deployer, uint256 fee) onlyOwner external {
        nftDeployers[nft] = NFTDeployer({
            deployer: deployer,
            fee: fee
        });
    }

    struct Sale {
        address seller;
        uint256 price;
    }
    mapping(INonFungibleToken => mapping(uint256 => Sale)) public sales;

    struct OfferInfo {
        address offeror;
        uint256 price;
    }
    mapping(INonFungibleToken => mapping(uint256 => OfferInfo[])) public offers;
    
    struct AuctionInfo {
        address seller;
        uint256 startPrice;
        uint256 endBlock;
    }
    mapping(INonFungibleToken => mapping(uint256 => AuctionInfo)) public auctions;
    
    struct Bidding {
        address bidder;
        uint256 price;
    }
    mapping(INonFungibleToken => mapping(uint256 => Bidding[])) public biddings;

    function sell(INonFungibleToken nft, uint256 nftId, uint256 price) override public {
        require(nft.ownerOf(nftId) == msg.sender && checkAuction(nft, nftId) != true);
        nft.transferFrom(msg.sender, address(this), nftId);
        sales[nft][nftId] = Sale({
            seller: msg.sender,
            price: price
        });
        emit Sell(nft, nftId, msg.sender, price);
    }

    function sellWithPermit(INonFungibleToken nft, uint256 nftId, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external {
        nft.permit(address(this), nftId, deadline, v, r, s);
        sell(nft, nftId, price);
    }

    function checkSelling(INonFungibleToken nft, uint256 nftId) override view public returns (bool) {
        return sales[nft][nftId].seller != address(0);
    }

    function distributeReward(INonFungibleToken nft, address to, uint256 price) internal {
        uint256 _ownerFee = price * ownerFee / 1e4;
        token.transfer(owner(), _ownerFee);
        
        NFTDeployer memory deployer = nftDeployers[nft];
        if (deployer.deployer != address(0)) {
            uint256 deployerFee = price * deployer.fee / 1e4;
            token.transfer(deployer.deployer, deployerFee);
            token.transfer(to, price - deployerFee - _ownerFee);
        } else {
            token.transfer(to, price - _ownerFee);
        }
    }

    function buy(INonFungibleToken nft, uint256 nftId) override public {
        Sale memory sale = sales[nft][nftId];
        require(sale.seller != address(0));
        delete sales[nft][nftId];
        nft.transferFrom(address(this), msg.sender, nftId);
        token.transferFrom(msg.sender, address(this), sale.price);
        distributeReward(nft, sale.seller, sale.price);
        emit Buy(nft, nftId, msg.sender, sale.price);
    }

    function buyWithPermit(INonFungibleToken nft, uint256 nftId,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external {
        token.permit(msg.sender, address(this), sales[nft][nftId].price, deadline, v, r, s);
        buy(nft, nftId);
    }

    function cancelSale(INonFungibleToken nft, uint256 nftId) override external {
        address seller = sales[nft][nftId].seller;
        require(seller == msg.sender);
        nft.transferFrom(address(this), seller, nftId);
        delete sales[nft][nftId];
        emit CancelSale(nft, nftId, msg.sender);
    }

    function offer(INonFungibleToken nft, uint256 nftId, uint256 price) override public returns (uint256 offerId) {
        require(price > 0);
        OfferInfo[] storage os = offers[nft][nftId];
        offerId = os.length;
        os.push(OfferInfo({
            offeror: msg.sender,
            price: price
        }));
        token.transferFrom(msg.sender, address(this), price);
        emit Offer(nft, nftId, offerId, msg.sender, price);
    }

    function offerWithPermit(INonFungibleToken nft, uint256 nftId, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external returns (uint256 offerId) {
        token.permit(msg.sender, address(this), price, deadline, v, r, s);
        return offer(nft, nftId, price);
    }

    function cancelOffer(INonFungibleToken nft, uint256 nftId, uint256 offerId) override external {
        OfferInfo[] storage os = offers[nft][nftId];
        OfferInfo memory _offer = os[offerId];
        require(_offer.offeror == msg.sender);
        uint256 price = _offer.price;
        delete os[offerId];
        token.transfer(msg.sender, price);
        emit CancelOffer(nft, nftId, offerId, _offer.offeror);
    }

    function acceptOffer(INonFungibleToken nft, uint256 nftId, uint256 offerId) override external {
        OfferInfo[] storage os = offers[nft][nftId];
        OfferInfo memory _offer = os[offerId];
        nft.transferFrom(msg.sender, _offer.offeror, nftId);
        uint256 price = _offer.price;
        delete os[offerId];
        distributeReward(nft, msg.sender, price);
        emit AcceptOffer(nft, nftId, offerId, msg.sender);
    }

    function auction(INonFungibleToken nft, uint256 nftId, uint256 startPrice, uint256 endBlock) override public {
        require(nft.ownerOf(nftId) == msg.sender && checkSelling(nft, nftId) != true);
        nft.transferFrom(msg.sender, address(this), nftId);
        auctions[nft][nftId] = AuctionInfo({
            seller: msg.sender,
            startPrice: startPrice,
            endBlock: endBlock
        });
        emit Auction(nft, nftId, msg.sender, startPrice, endBlock);
    }

    function auctionWithPermit(INonFungibleToken nft, uint256 nftId, uint256 startPrice, uint256 endBlock,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external {
        nft.permit(address(this), nftId, deadline, v, r, s);
        auction(nft, nftId, startPrice, endBlock);
    }

    function cancelAuction(INonFungibleToken nft, uint256 nftId) override external {
        require(biddings[nft][nftId].length == 0);
        address seller = auctions[nft][nftId].seller;
        require(seller == msg.sender);
        nft.transferFrom(address(this), seller, nftId);
        delete auctions[nft][nftId];
        emit CancelAuction(nft, nftId, msg.sender);
    }

    function checkAuction(INonFungibleToken nft, uint256 nftId) override view public returns (bool) {
        return auctions[nft][nftId].seller != address(0);
    }

    function bid(INonFungibleToken nft, uint256 nftId, uint256 price) override public returns (uint256 biddingId) {
        AuctionInfo memory _auction = auctions[nft][nftId];
        require(_auction.seller != address(0) && block.number < _auction.endBlock);
        Bidding[] storage bs = biddings[nft][nftId];
        biddingId = bs.length;
        if (biddingId == 0) {
            require(_auction.startPrice <= price);
        } else {
            Bidding memory bestBidding = bs[biddingId - 1];
            require(bestBidding.price < price);
            token.transfer(bestBidding.bidder, bestBidding.price);
        }
        bs.push(Bidding({
            bidder: msg.sender,
            price: price
        }));
        token.transferFrom(msg.sender, address(this), price);
        emit Bid(nft, nftId, msg.sender, price);
    }

    function bidWithPermit(INonFungibleToken nft, uint256 nftId, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external returns (uint256 biddingId) {
        token.permit(msg.sender, address(this), price, deadline, v, r, s);
        return bid(nft, nftId, price);
    }

    function claim(INonFungibleToken nft, uint256 nftId) override external {
        AuctionInfo memory _auction = auctions[nft][nftId];
        Bidding[] memory bs = biddings[nft][nftId];
        Bidding memory bidding = bs[bs.length - 1];
        require(bidding.bidder == msg.sender && block.number >= _auction.endBlock);
        delete auctions[nft][nftId];
        delete biddings[nft][nftId];
        nft.transferFrom(address(this), msg.sender, nftId);
        distributeReward(nft, _auction.seller, bidding.price);
        emit Claim(nft, nftId, msg.sender, bidding.price);
    }
}
