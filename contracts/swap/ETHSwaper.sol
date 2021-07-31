// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/IETHSwaper.sol";
import "./Swaper.sol";
import "../token/interfaces/IWETH.sol";
import "../token/WETH.sol";

contract ETHSwaper is Swaper, IETHSwaper {

    IWETH override public weth;

    constructor() {
        weth = new WETH();
    }

    function addLiquidityETH(
        IFungibleToken token, uint256 tokenAmount
    ) payable override public returns (uint256 liquidity, uint256 resultTokenAmount, uint256 resultETHAmount) {
        weth.deposit{value: msg.value}();
        (liquidity, resultTokenAmount, resultETHAmount) = _addLiquidity(token, tokenAmount, weth, msg.value);
        IFungibleToken(token).transferFrom(address(this), msg.sender, tokenAmount - resultTokenAmount);
        uint256 remainETHAmount = msg.value - resultETHAmount;
        weth.withdraw(remainETHAmount);
        payable(msg.sender).transfer(remainETHAmount);
    }

    function addLiquidityETHWithPermit(
        IFungibleToken token, uint256 tokenAmount,
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) payable override external returns (uint256 liquidity, uint256 resultTokenAmount, uint256 resultETHAmount) {
        token.permit(msg.sender, address(this), tokenAmount, deadline, v, r, s);
        return addLiquidityETH(token, tokenAmount);
    }

    function subtractLiquidityETH(address token, uint256 liquidity) override external returns (uint256 tokenAmount, uint256 ethAmount) {
        (tokenAmount, ethAmount) = _subtractLiquidity(token, address(weth), liquidity);
        IFungibleToken(token).transferFrom(address(this), msg.sender, tokenAmount);
        weth.withdraw(ethAmount);
        payable(msg.sender).transfer(ethAmount);
    }

    function swapFromETH(address[] memory path) payable override external returns (uint256 amountOut) {
        weth.deposit{value: msg.value}();
        uint256 amountIn = swapOnce(address(weth), path[0], msg.value);
        return swap(path, amountIn);
    }

    function swapToETH(address[] memory path, uint256 amountIn) override public returns (uint256 ethAmountOut) {
        ethAmountOut = _swap(path, amountIn);
        weth.withdraw(ethAmountOut);
        payable(msg.sender).transfer(ethAmountOut);
    }
    
    function swapToETHWithPermit(address[] memory path, uint256 amountIn,
        uint256 deadline, uint8 v, bytes32 r, bytes32 s
    ) override external returns (uint256 ethAmountOut) {
        IFungibleToken(path[0]).permit(msg.sender, address(this), amountIn, deadline, v, r, s);
        return swapToETH(path, amountIn);
    }
}
