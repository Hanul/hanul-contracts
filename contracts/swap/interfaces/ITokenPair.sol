// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface ITokenPair is IFungibleToken {
    
    function addLiquidity(uint256 amount1, uint256 amount2) external returns (uint256 liquidity);
    function addLiquidityWithPermit(
        uint256 amount1, uint256 amount2,
        uint256 deadline,
        uint8 v1, bytes32 r1, bytes32 s1,
        uint8 v2, bytes32 r2, bytes32 s2
    ) external returns (uint256 liquidity);
    
    function subtractLiquidity(uint256 liquidity) external returns (uint256 amount1, uint256 amount2);
    
    function swap1(uint256 amountIn) external returns (uint256 amountOut);
    function swap1WithPermit(
        uint256 amountIn, 
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) external returns (uint256 amountOut);
    
    function swap2(uint256 amountIn) external returns (uint256 amountOut);
    function swap2WithPermit(
        uint256 amountIn, 
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) external returns (uint256 amountOut);
}
