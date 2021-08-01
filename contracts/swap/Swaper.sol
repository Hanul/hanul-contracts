// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/ISwaper.sol";
import "../token/interfaces/IFungibleToken.sol";
import "./TokenPair.sol";
import "../libraries/String.sol";

contract Swaper is ISwaper {

    address override public feeTo;
    address override public feeToSetter;

    mapping(address => mapping(address => ITokenPair)) internal tokenToPair;
    ITokenPair[] override public pairs;

    constructor() {
        feeToSetter = msg.sender;
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter);
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter);
        feeToSetter = _feeToSetter;
    }
    
    function calculateFee(uint256 amount) override external pure returns (uint256 fee) {
        fee = amount * 3 / 1000; // 0.3%
    }

    function pairCount() override external view returns (uint256) {
        return pairs.length;
    }

    function getPair(address token1, address token2) override external view returns (ITokenPair) {
        return token1 < token2 ? tokenToPair[token1][token2] : tokenToPair[token2][token1];
    }

    function _addLiquidity(
        IFungibleToken token1, uint256 amount1,
        IFungibleToken token2, uint256 amount2
    ) internal returns (uint256 liquidity, uint256 resultAmount1, uint256 resultAmount2) {
        
        if (token1 > token2) {
            (liquidity, resultAmount2, resultAmount1) = _addLiquidity(token2, amount2, token1, amount1);
        } else {
            
            token1.transferFrom(msg.sender, address(this), amount1);
            token2.transferFrom(msg.sender, address(this), amount2);

            ITokenPair pair = tokenToPair[address(token1)][address(token2)];
            if (address(pair) == address(0)) {

                uint256 pairId = pairs.length;

                pair = new TokenPair(
                    String.convertUint256ToString(pairId),
                    token1,
                    token2
                );
                token1.approve(address(pair), type(uint256).max);
                token2.approve(address(pair), type(uint256).max);
                tokenToPair[address(token1)][address(token2)] = pair;
                pairs.push(pair);

                emit CreatePair(pairId, address(pair), address(token1), address(token2));
            }

            return pair.addLiquidity(msg.sender, amount1, amount2);
        }
    }

    function addLiquidity(
        IFungibleToken token1, uint256 amount1,
        IFungibleToken token2, uint256 amount2
    ) override public returns (uint256 liquidity, uint256 resultAmount1, uint256 resultAmount2) {
        (liquidity, resultAmount1, resultAmount2) = _addLiquidity(token1, amount1, token2, amount2);
        IFungibleToken(token1).transfer(msg.sender, amount1 - resultAmount1);
        IFungibleToken(token2).transfer(msg.sender, amount2 - resultAmount2);
    }
    
    function addLiquidityWithPermit(
        IFungibleToken token1, uint256 amount1,
        IFungibleToken token2, uint256 amount2,
        uint256 deadline,
        uint8 v1, bytes32 r1, bytes32 s1,
        uint8 v2, bytes32 r2, bytes32 s2
    ) override external {
        token1.permit(msg.sender, address(this), amount1, deadline, v1, r1, s1);
        token2.permit(msg.sender, address(this), amount2, deadline, v2, r2, s2);
        addLiquidity(token1, amount1, token2, amount2);
    }

    function _subtractLiquidity(address token1, address token2, uint256 liquidity) internal returns (uint256 amount1, uint256 amount2) {
        if (token1 > token2) {
            (amount2, amount1) = _subtractLiquidity(token2, token1, liquidity);
        } else {
            (amount1, amount2) = tokenToPair[token1][token2].subtractLiquidity(msg.sender, liquidity);
        }
    }

    function subtractLiquidity(address token1, address token2, uint256 liquidity) override public returns (uint256 amount1, uint256 amount2) {
        (amount1, amount2) = _subtractLiquidity(token1, token2, liquidity);
        IFungibleToken(token1).transfer(msg.sender, amount1);
        IFungibleToken(token2).transfer(msg.sender, amount2);
    }

    function swapOnce(address token1, address token2, uint256 amountIn) internal returns (uint256 amountOut) {
        if (token1 > token2) {
            amountOut = tokenToPair[token2][token1].swap2(msg.sender, amountIn);
        } else {
            amountOut = tokenToPair[token1][token2].swap1(msg.sender, amountIn);
        }
    }

    function _swap(address[] memory path, uint256 amountIn) internal returns (uint256 amountOut) {
        uint256 to = path.length - 1;
        for (uint256 i = 0; i < to; i += 1) {
            amountIn = swapOnce(path[i], path[i + 1], amountIn);
        }
        return amountIn;
    }

    function swap(address[] memory path, uint256 amountIn) override public returns (uint256 amountOut) {
        amountOut = _swap(path, amountIn);
        IFungibleToken(path[path.length - 1]).transfer(msg.sender, amountOut);
    }
    
    function swapWithPermit(address[] memory path, uint256 amountIn,
        uint256 deadline, uint8 v, bytes32 r, bytes32 s
    ) override external returns (uint256 amountOut) {
        IFungibleToken(path[0]).permit(msg.sender, address(this), amountIn, deadline, v, r, s);
        return swap(path, amountIn);
    }
}
