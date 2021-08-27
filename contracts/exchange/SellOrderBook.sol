// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/ISellOrderBook.sol";
import "../token/interfaces/IFungibleToken.sol";

contract SellOrderBook is ISellOrderBook {
    
    struct SellOrder {
        address seller;
        uint256 amount;
        uint256 price;
    }
    mapping(IFungibleToken => SellOrder[]) public orders;

    function count(IFungibleToken token) override external view returns (uint256) {
        return orders[token].length;
    }

    function get(IFungibleToken token, uint256 orderId) override external view returns (address seller, uint256 amount, uint256 price) {
        SellOrder memory order = orders[token][orderId];
        return (order.seller, order.amount, order.price);
    }

    function sell(IFungibleToken token, uint256 amount, uint256 price) override public {
        SellOrder[] storage _orders = orders[token];
        token.transferFrom(msg.sender, address(this), amount);
        uint256 orderId = _orders.length;
        _orders.push(SellOrder({
            seller: msg.sender,
            amount: amount,
            price: price
        }));
        emit Sell(token, orderId, msg.sender, amount, price);
    }

    function sellWithPermit(IFungibleToken token, uint256 amount, uint256 price,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external {
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        sell(token, amount, price);
    }

    function remove(IFungibleToken token, uint256 orderId) internal {
        delete orders[token][orderId];
        emit Remove(token, orderId);
    }

    function buy(IFungibleToken token, uint256 orderId) override payable external {
        SellOrder storage order = orders[token][orderId];
        uint256 amount = order.amount * msg.value / order.price;
        token.transfer(msg.sender, amount);
        order.amount -= amount;
        order.price -= msg.value;
        if (order.amount == 0) {
            remove(token, orderId);
        }
        payable(order.seller).transfer(msg.value);
        emit Buy(token, orderId, msg.sender, amount);
    }

    function cancel(IFungibleToken token, uint256 orderId) override external {
        SellOrder memory order = orders[token][orderId];
        require(order.seller == msg.sender);
        token.transfer(msg.sender, order.amount);
        remove(token, orderId);
        emit Cancel(token, orderId);
    }
}
