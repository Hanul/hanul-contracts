// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface ITokenPair is IFungibleToken {

    event AddLiquidity(uint256 liquidity, uint256 amount1, uint256 amount2);
    event SubtractLiquidity(uint256 liquidity, uint256 amount1, uint256 amount2);
    event Swap1(uint256 amountIn, uint256 amountOut);
    event Swap2(uint256 amountIn, uint256 amountOut);

    function addLiquidity(uint256 amount1, uint256 amount2) external returns (uint256 liquidity, uint256 resultAmount1, uint256 resultAmount2);
    function subtractLiquidity(uint256 liquidity) external returns (uint256 amount1, uint256 amount2);
    function swap1(uint256 amountIn) external returns (uint256 amountOut);
    function swap2(uint256 amountIn) external returns (uint256 amountOut);
}
