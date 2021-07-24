// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

interface IBuyOrderBook {

    event Buy(uint256 indexed orderId, address indexed buyer, uint256 amount, uint256 price);
    event Remove(uint256 indexed orderId);
    event Sell(uint256 indexed orderId, address indexed seller, uint256 amount);
    event Cancel(uint256 indexed orderId);

    function count() external view returns (uint256);
    function get(uint256 orderId) external view returns (address buyer, uint256 amount, uint256 price);
    function buy(uint256 amount) payable external;

    function sell(uint256 orderId, uint256 amount) external;
    function sellWithPermit(uint256 orderId, uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function cancel(uint256 orderId) external;
}
