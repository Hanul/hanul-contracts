// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./ISwaper.sol";
import "../../token/interfaces/IWETH.sol";

interface IETHSwaper is ISwaper {

    function weth() external view returns (IWETH);
    
    function addLiquidityETH(
        address ethAmount,
        address token, uint256 tokenAmount
    ) external returns (uint256 resultTokenAmount, address resultETHAmount);

    function addLiquidityETHWithPermit(
        address ethAmount,
        address token, uint256 tokenAmount,
        uint256 deadline,
        uint8 v1, bytes32 r1, bytes32 s1,
        uint8 v2, bytes32 r2, bytes32 s2
    ) external returns (uint256 resultTokenAmount, address resultETHAmount);

    function swapETH(address[] memory path) payable external returns (uint256 amountOut);
}
