// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "../token/interfaces/IFungibleToken.sol";
import "./interfaces/ITokenPair.sol";
import "./interfaces/ISwaper.sol";
import '../libraries/Math.sol';

contract TokenPair is FungibleToken, ITokenPair {

    uint256 public constant MINIMUM_LIQUIDITY = 1e3;

    ISwaper public swaper;
    IFungibleToken public token1;
    IFungibleToken public token2;

    constructor(
        string memory id,
        IFungibleToken _token1,
        IFungibleToken _token2
    ) FungibleToken(
        string(abi.encodePacked("TokenPair #", id)),
        string(abi.encodePacked("PAIR-", id)),
        "1"
    ) {
        swaper = ISwaper(msg.sender);
        token1 = _token1;
        token2 = _token2;
    }
    
    function addLiquidity(uint256 amount1, uint256 amount2) override public returns (uint256 liquidity) {
        
        token1.transferFrom(msg.sender, address(this), amount1);
        token2.transferFrom(msg.sender, address(this), amount2);

        uint256 _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount1 * amount2) - MINIMUM_LIQUIDITY;
            _mint(address(this), MINIMUM_LIQUIDITY);
        } else {
            liquidity = Math.min(amount1 * _totalSupply, amount2 * _totalSupply);
        }
        _mint(msg.sender, liquidity);
    }
    
    function addLiquidityWithPermit(
        uint256 amount1, uint256 amount2,
        uint256 deadline,
        uint8 v1, bytes32 r1, bytes32 s1,
        uint8 v2, bytes32 r2, bytes32 s2
    ) override external returns (uint256 liquidity) {
        token1.permit(msg.sender, address(this), amount1, deadline, v1, r1, s1);
        token2.permit(msg.sender, address(this), amount2, deadline, v2, r2, s2);
        return addLiquidity(amount1, amount2);
    }
    
    function subtractLiquidity(uint256 liquidity) override external returns (uint256 amount1, uint256 amount2) {
        
        uint256 balance1 = token1.balanceOf(address(this));
        uint256 balance2 = token2.balanceOf(address(this));

        uint256 _totalSupply = totalSupply();
        amount1 = balance1 * liquidity / _totalSupply;
        amount2 = balance2 * liquidity / _totalSupply;
        
        token1.transferFrom(address(this), msg.sender, amount1);
        token2.transferFrom(address(this), msg.sender, amount2);

        _burn(msg.sender, liquidity);
    }

    function swap1(uint256 amountIn) override public returns (uint256 amountOut) {

        uint256 balance1 = token1.balanceOf(address(this));
        uint256 balance2 = token2.balanceOf(address(this));

        amountOut = balance2 * amountIn / balance1;
        uint256 feeIn = swaper.calculateFee(amountIn);
        uint256 feeOut = swaper.calculateFee(amountOut);

        token1.transferFrom(msg.sender, address(this), amountIn);
        token1.transferFrom(address(this), swaper.feeTo(), feeIn);
        token2.transferFrom(address(this), msg.sender, amountOut - feeOut);
        token2.transferFrom(address(this), swaper.feeTo(), feeOut);
    }
    
    function swap1WithPermit(
        uint256 amountIn, 
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) override external returns (uint256 amountOut) {
        token1.permit(msg.sender, address(this), amountIn, deadline, v, r, s);
        return swap1(amountIn);
    }

    function swap2(uint256 amountIn) override public returns (uint256 amountOut) {

        uint256 balance2 = token2.balanceOf(address(this));
        uint256 balance1 = token1.balanceOf(address(this));

        amountOut = balance1 * amountIn / balance2;
        uint256 feeIn = swaper.calculateFee(amountIn);
        uint256 feeOut = swaper.calculateFee(amountOut);

        token2.transferFrom(msg.sender, address(this), amountIn);
        token2.transferFrom(address(this), swaper.feeTo(), feeIn);
        token1.transferFrom(address(this), msg.sender, amountOut - feeOut);
        token1.transferFrom(address(this), swaper.feeTo(), feeOut);
    }
    
    function swap2WithPermit(
        uint256 amountIn, 
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) override external returns (uint256 amountOut) {
        token2.permit(msg.sender, address(this), amountIn, deadline, v, r, s);
        return swap2(amountIn);
    }
}
