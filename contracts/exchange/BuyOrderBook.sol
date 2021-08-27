// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/IBuyOrderBook.sol";
import "../token/interfaces/IFungibleToken.sol";

contract BuyOrderBook is IBuyOrderBook {
    
    struct BuyOrder {
        address buyer;
        uint256 amount;
        uint256 price;
    }
    mapping(IFungibleToken => BuyOrder[]) public orders;

    function count(IFungibleToken token) override external view returns (uint256) {
        return orders[token].length;
    }

    function get(IFungibleToken token, uint256 orderId) override external view returns (address buyer, uint256 amount, uint256 price) {
        BuyOrder memory order = orders[token][orderId];
        return (order.buyer, order.amount, order.price);
    }

    function buy(IFungibleToken token, uint256 amount) override payable external {
        BuyOrder[] storage _orders = orders[token];
        uint256 orderId = _orders.length;
        _orders.push(BuyOrder({
            buyer: msg.sender,
            amount: amount,
            price: msg.value
        }));
        emit Buy(token, orderId, msg.sender, amount, msg.value);
    }

    function remove(IFungibleToken token, uint256 orderId) internal {
        delete orders[token][orderId];
        emit Remove(token, orderId);
    }

    function sell(IFungibleToken token, uint256 orderId, uint256 amount) override public {
        BuyOrder storage order = orders[token][orderId];
        uint256 price = order.price * amount / order.amount;
        token.transferFrom(msg.sender, order.buyer, amount);
        order.amount -= amount;
        order.price -= price;
        if (order.amount == 0) {
            remove(token, orderId);
        }
        payable(msg.sender).transfer(price);
        emit Sell(token, orderId, msg.sender, amount);
    }

    function sellWithPermit(IFungibleToken token, uint256 orderId, uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) override external {
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        sell(token, orderId, amount);
    }

    function cancel(IFungibleToken token, uint256 orderId) override external {
        BuyOrder memory order = orders[token][orderId];
        require(order.buyer == msg.sender);
        payable(msg.sender).transfer(order.price);
        remove(token, orderId);
        emit Cancel(token, orderId);
    }
}
