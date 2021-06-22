// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IDividend.sol";

contract Dividend is FungibleToken, IDividend {

    IERC20 public token;
    uint256 internal currentBalance;

    uint256 constant internal pointsMultiplier = 2**128;
    uint256 internal pointsPerShare;
    mapping(address => int256) internal pointsCorrection;
    mapping(address => uint256) internal withdrawns;

    constructor(
        string memory name,
        string memory symbol,
        string memory version,
        address tokenAddress
    ) FungibleToken(name, symbol, version) {
        token = IERC20(tokenAddress);
    }

    function updateBalance() internal {
        uint256 totalBalance = totalSupply();
        require(totalBalance > 0);
        uint256 balance = token.balanceOf(address(this));
        uint256 value = balance - currentBalance;
        if (value > 0) {
            pointsPerShare += value * pointsMultiplier / totalSupply();
            emit Distributed(msg.sender, value);
        }
        currentBalance = balance;
    }

    function withdraw() public {
        updateBalance();
        uint256 withdrawable = withdrawableOf(msg.sender);
        if (withdrawable > 0) {
            withdrawns[msg.sender] += withdrawable;
            emit Withdrawn(msg.sender, withdrawable);
            token.transfer(msg.sender, withdrawable);
        }
    }

    function accumulativeOf(address owner) public view returns (uint256) {
        return uint256(int256(pointsPerShare * balanceOf(owner)) + pointsCorrection[owner]) / pointsMultiplier;
    }

    function withdrawnOf(address owner) public view returns (uint256) {
        return withdrawns[owner];
    }

    function withdrawableOf(address owner) public view returns (uint256) {
        return accumulativeOf(owner) - withdrawnOf(owner);
    }

    function _transfer(address from, address to, uint256 value) external {
        super._transfer(from, to, value);
        updateBalance();
        int256 magCorrection = int256(pointsPerShare * value);
        pointsCorrection[from] += magCorrection;
        pointsCorrection[to] -= magCorrection;
    }

    function _mint(address to, uint256 value) external {
        super._mint(to, value);
        updateBalance();
        pointsCorrection[to] -= int256(pointsPerShare * value);
    }

    function _burn(address from, uint256 value) external {
        super._burn(from, value);
        updateBalance();
        pointsCorrection[from] += int256(pointsPerShare * value);
    }
}
