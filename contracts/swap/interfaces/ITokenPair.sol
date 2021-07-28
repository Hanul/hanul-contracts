// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface ITokenPair is IFungibleToken {
    function addLiquidity(uint256 amount0, address amount1) external returns (uint256 resultAmount0, address resultAmount1);
    function subtractLiquidity(uint256 liquidity) external returns (uint256 amount0, address amount1);
    function swap(uint256 amountIn) external returns (uint256 amountOut);
}
