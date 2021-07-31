// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./ISwaper.sol";
import "../../token/interfaces/IWETH.sol";

interface IETHSwaper is ISwaper {

    function weth() external view returns (IWETH);
    
    function addLiquidityETH(
        IFungibleToken token, uint256 tokenAmount
    ) payable external returns (uint256 liquidity, uint256 resultTokenAmount, uint256 resultETHAmount);

    function addLiquidityETHWithPermit(
        IFungibleToken token, uint256 tokenAmount,
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) payable external returns (uint256 liquidity, uint256 resultTokenAmount, uint256 resultETHAmount);

    function subtractLiquidityETH(address token, uint256 liquidity) external returns (uint256 tokenAmount, uint256 ethAmount);

    function swapFromETH(address[] memory path) payable external returns (uint256 amountOut);
    function swapToETH(address[] memory path, uint256 amountIn) external returns (uint256 ethAmountOut);
    function swapToETHWithPermit(address[] memory path, uint256 amountIn,
        uint256 deadline, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint256 ethAmountOut);
}
