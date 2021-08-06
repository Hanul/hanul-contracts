// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/IETHSwaper.sol";
import "./interfaces/ISwaper.sol";
import "../token/interfaces/IWETH.sol";
import "../token/WETH.sol";

contract ETHSwaper is IETHSwaper {

    ISwaper override public swaper;
    IWETH override public weth;

    mapping(address => bool) private approved;

    constructor(ISwaper _swaper) {
        swaper = _swaper;
        weth = new WETH();
        weth.approve(address(swaper), type(uint256).max);
    }

    receive() external payable {}

    function addLiquidity(
        address to, IFungibleToken token, uint256 tokenAmount
    ) payable override public returns (uint256 liquidity, uint256 resultTokenAmount, uint256 resultETHAmount) {
        
        token.transferFrom(msg.sender, address(this), tokenAmount);
        if (approved[address(token)] != true) {
            token.approve(address(swaper), type(uint256).max);
            approved[address(token)] = true;
        }
        weth.deposit{value: msg.value}();
        
        (liquidity, resultTokenAmount, resultETHAmount) = swaper.addLiquidity(to, token, tokenAmount, weth, msg.value);
        
        IFungibleToken(token).transfer(msg.sender, tokenAmount - resultTokenAmount);
        uint256 remainETHAmount = msg.value - resultETHAmount;
        weth.withdraw(remainETHAmount);
        payable(msg.sender).transfer(remainETHAmount);
    }

    function addLiquidityWithPermit(
        address to, IFungibleToken token, uint256 tokenAmount,
        uint256 deadline,
        uint8 v, bytes32 r, bytes32 s
    ) payable override external returns (uint256 liquidity, uint256 resultTokenAmount, uint256 resultETHAmount) {
        token.permit(msg.sender, address(this), tokenAmount, deadline, v, r, s);
        return addLiquidity(to, token, tokenAmount);
    }

    function subtractLiquidity(address from, address token, uint256 liquidity) override external returns (uint256 tokenAmount, uint256 ethAmount) {
        (tokenAmount, ethAmount) = swaper.subtractLiquidity(from, token, address(weth), liquidity);
        IFungibleToken(token).transfer(msg.sender, tokenAmount);
        weth.withdraw(ethAmount);
        payable(msg.sender).transfer(ethAmount);
    }

    function swapFromETH(address[] memory path) payable override external returns (uint256 amountOut) {
        weth.deposit{value: msg.value}();
        address[] memory _path = new address[](2);
        _path[0] = address(weth);
        _path[1] = path[0];
        uint256 amountIn = swaper.swap(_path, msg.value);
        if (path.length == 1) {
            IFungibleToken(path[0]).transfer(msg.sender, amountIn);
        } else {
            amountOut = swaper.swap(path, amountIn);
            IFungibleToken(path[path.length - 1]).transfer(msg.sender, amountOut);
        }
    }

    function swapToETH(address[] memory path, uint256 amountIn) override public returns (uint256 ethAmountOut) {
        IFungibleToken(path[0]).transferFrom(msg.sender, address(this), amountIn);
        if (path.length > 1) {
            amountIn = swaper.swap(path, amountIn);
        }
        address[] memory _path = new address[](2);
        _path[0] = path[0];
        _path[1] = address(weth);
        ethAmountOut = swaper.swap(_path, amountIn);
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
