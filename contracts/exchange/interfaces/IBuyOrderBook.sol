// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface IBuyOrderBook {

    event Buy(IFungibleToken indexed token, uint256 indexed orderId, address indexed buyer, uint256 amount, uint256 price);
    event Remove(IFungibleToken indexed token, uint256 indexed orderId);
    event Sell(IFungibleToken indexed token, uint256 indexed orderId, address indexed seller, uint256 amount);
    event Cancel(IFungibleToken indexed token, uint256 indexed orderId);

    function count(IFungibleToken token) external view returns (uint256);
    function get(IFungibleToken token, uint256 orderId) external view returns (address buyer, uint256 amount, uint256 price);
    function buy(IFungibleToken token, uint256 amount) payable external;

    function sell(IFungibleToken token, uint256 orderId, uint256 amount) external;
    function sellWithPermit(IFungibleToken token, uint256 orderId, uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function cancel(IFungibleToken token, uint256 orderId) external;
}
