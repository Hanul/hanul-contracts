// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/INFTMarketplace.sol";

contract NFTMarketplace is Ownable, INFTMarketplace {

    uint256 public ownerFee = 25 * 1e18 / 100;

    function setOwnerFee(uint256 fee) onlyOwner external {
        ownerFee = fee;
    }
    
    struct NFTDeployer {
        address deployer;
        uint256 fee; // 1e18
    }
    mapping(INonFungibleToken => NFTDeployer) public nftDeployers;

    function setNFTDeployer(INonFungibleToken token, address deployer, uint256 fee) onlyOwner external {
        nftDeployers[token] = NFTDeployer({
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

    function sell(INonFungibleToken token, uint256 nftId, uint256 price) override external {
        require(token.ownerOf(nftId) == msg.sender && checkAuction(token, nftId) != true);
        token.transferFrom(msg.sender, address(this), nftId);
        sales[token][nftId] = Sale({
            seller: msg.sender,
            price: price
        });
        emit Sell(token, nftId, msg.sender, price);
    }

    function checkSelling(INonFungibleToken token, uint256 nftId) override view public returns (bool) {
        return sales[token][nftId].seller != address(0);
    }

    function distributeReward(INonFungibleToken token, address to, uint256 price) internal {
        uint256 _ownerFee = price * ownerFee / 1e18;
        payable(owner()).transfer(_ownerFee);
        
        NFTDeployer memory deployer = nftDeployers[token];
        if (deployer.deployer != address(0)) {
            uint256 deployerFee = price * deployer.fee / 1e18;
            payable(deployer.deployer).transfer(deployerFee);
            payable(to).transfer(price - deployerFee - _ownerFee);
        } else {
            payable(to).transfer(price - _ownerFee);
        }
    }

    function buy(INonFungibleToken token, uint256 nftId) payable override external {
        Sale memory sale = sales[token][nftId];
        require(sale.seller != address(0) && sale.price == msg.value);
        delete sales[token][nftId];
        token.transferFrom(address(this), msg.sender, nftId);
        distributeReward(token, sale.seller, msg.value);
        emit Buy(token, nftId, msg.sender);
    }

    function cancelSale(INonFungibleToken token, uint256 nftId) override external {
        address seller = sales[token][nftId].seller;
        require(seller == msg.sender);
        token.transferFrom(address(this), seller, nftId);
        delete sales[token][nftId];
        emit CancelSale(token, nftId, msg.sender);
    }

    function offer(INonFungibleToken token, uint256 nftId) payable override external returns (uint256 offerId) {
        require(msg.value > 0);
        OfferInfo[] storage os = offers[token][nftId];
        offerId = os.length;
        os.push(OfferInfo({
            offeror: msg.sender,
            price: msg.value
        }));
        emit Offer(token, nftId, offerId, msg.sender, msg.value);
    }

    function cancelOffer(INonFungibleToken token, uint256 nftId, uint256 offerId) override external {
        OfferInfo[] storage os = offers[token][nftId];
        OfferInfo memory _offer = os[offerId];
        require(_offer.offeror == msg.sender);
        uint256 price = _offer.price;
        delete os[offerId];
        payable(msg.sender).transfer(price);
        emit CancelOffer(token, nftId, offerId, _offer.offeror);
    }

    function acceptOffer(INonFungibleToken token, uint256 nftId, uint256 offerId) override external {
        OfferInfo[] storage os = offers[token][nftId];
        OfferInfo memory _offer = os[offerId];
        token.transferFrom(msg.sender, _offer.offeror, nftId);
        uint256 price = _offer.price;
        delete os[offerId];
        distributeReward(token, msg.sender, price);
        emit AcceptOffer(token, nftId, offerId, msg.sender);
    }

    function auction(INonFungibleToken token, uint256 nftId, uint256 startPrice, uint256 endBlock) override external {
        require(token.ownerOf(nftId) == msg.sender && checkSelling(token, nftId) != true);
        token.transferFrom(msg.sender, address(this), nftId);
        auctions[token][nftId] = AuctionInfo({
            seller: msg.sender,
            startPrice: startPrice,
            endBlock: endBlock
        });
        emit Auction(token, nftId, msg.sender, startPrice, endBlock);
    }

    function cancelAuction(INonFungibleToken token, uint256 nftId) override external {
        require(biddings[token][nftId].length == 0);
        address seller = auctions[token][nftId].seller;
        require(seller == msg.sender);
        token.transferFrom(address(this), seller, nftId);
        delete auctions[token][nftId];
        emit CancelAuction(token, nftId, msg.sender);
    }

    function checkAuction(INonFungibleToken token, uint256 nftId) override view public returns (bool) {
        return auctions[token][nftId].seller != address(0);
    }

    function bid(INonFungibleToken token, uint256 nftId) payable override external returns (uint256 biddingId) {
        AuctionInfo memory _auction = auctions[token][nftId];
        require(_auction.seller != address(0) && block.number < _auction.endBlock);
        Bidding[] storage bs = biddings[token][nftId];
        biddingId = bs.length;
        if (biddingId == 0) {
            require(_auction.startPrice <= msg.value);
        } else {
            Bidding memory bestBidding = bs[biddingId - 1];
            require(bestBidding.price < msg.value);
            payable(bestBidding.bidder).transfer(bestBidding.price);
        }
        bs.push(Bidding({
            bidder: msg.sender,
            price: msg.value
        }));
        emit Bid(token, nftId, msg.sender, msg.value);
    }

    function claim(INonFungibleToken token, uint256 nftId) override external {
        AuctionInfo memory _auction = auctions[token][nftId];
        Bidding[] memory bs = biddings[token][nftId];
        Bidding memory bidding = bs[bs.length - 1];
        require(bidding.bidder == msg.sender && block.number >= _auction.endBlock);
        delete auctions[token][nftId];
        delete biddings[token][nftId];
        token.transferFrom(address(this), msg.sender, nftId);
        distributeReward(token, _auction.seller, bidding.price);
        emit Claim(token, nftId, msg.sender, bidding.price);
    }
}
