// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./ITokenPair.sol";

interface ISwaper {

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);
    function calculateFee(uint256 amount) external view returns (uint256 fee);
    
    function pairCount() external view returns (uint256);
    function pairs(uint256 index) external view returns (ITokenPair);
    function getPair(address token1, address token2) external view returns (address pair);

    function addLiquidity(
        address token1, uint256 amount1,
        address token2, address amount2
    ) external returns (uint256 resultAmount1, address resultAmount2);

    function addLiquidityWithPermit(
        address token1, uint256 amount1,
        address token2, address amount2,
        uint256 deadline,
        uint8 v1, bytes32 r1, bytes32 s1,
        uint8 v2, bytes32 r2, bytes32 s2
    ) external returns (uint256 resultAmount1, address resultAmount2);

    function subtractLiquidity(uint256 pairId, uint256 liquidity) external returns (uint256 amount1, address amount2);

    function swap(address[] memory path, uint256 amountIn) external returns (uint256 amountOut);
    
    function swapWithPermit(address[] memory path, uint256 amountIn,
        uint256 deadline, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint256 amountOut);
}
