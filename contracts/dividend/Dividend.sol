// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IDividend.sol";

contract Dividend is FungibleToken, IDividend {

    IERC20 override public token;
    uint256 internal currentBalance = 0;

    uint256 constant internal pointsMultiplier = 2**128;
    uint256 internal pointsPerShare = 0;
    mapping(address => int256) internal pointsCorrection;
    mapping(address => uint256) internal claimed;

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
            emit Distribute(msg.sender, value);
        }
        currentBalance = balance;
    }

    function claimedOf(address owner) override public view returns (uint256) {
        return claimed[owner];
    }

    function accumulativeOf(address owner) override public view returns (uint256) {
        uint256 _pointsPerShare = pointsPerShare;
        uint256 totalBalance = totalSupply();
        require(totalBalance > 0);
        uint256 balance = token.balanceOf(address(this));
        uint256 value = balance - currentBalance;
        if (value > 0) {
            _pointsPerShare += value * pointsMultiplier / totalSupply();
        }
        return uint256(int256(_pointsPerShare * balanceOf(owner)) + pointsCorrection[owner]) / pointsMultiplier;
    }

    function claimableOf(address owner) override external view returns (uint256) {
        return accumulativeOf(owner) - claimed[owner];
    }

    function _accumulativeOf(address owner) internal view returns (uint256) {
        return uint256(int256(pointsPerShare * balanceOf(owner)) + pointsCorrection[owner]) / pointsMultiplier;
    }

    function _claimableOf(address owner) internal view returns (uint256) {
        return _accumulativeOf(owner) - claimed[owner];
    }

    function claim() override public {
        updateBalance();
        uint256 claimable = _claimableOf(msg.sender);
        if (claimable > 0) {
            claimed[msg.sender] += claimable;
            emit Claim(msg.sender, claimable);
            token.transfer(msg.sender, claimable);
            currentBalance -= claimable;
        }
    }

    function _transfer(address from, address to, uint256 value) override internal {
        super._transfer(from, to, value);
        updateBalance();
        int256 correction = int256(pointsPerShare * value);
        pointsCorrection[from] += correction;
        pointsCorrection[to] -= correction;
    }

    function _mint(address to, uint256 value) override internal {
        super._mint(to, value);
        updateBalance();
        pointsCorrection[to] -= int256(pointsPerShare * value);
    }

    function _burn(address from, uint256 value) override internal {
        super._burn(from, value);
        updateBalance();
        pointsCorrection[from] += int256(pointsPerShare * value);
    }
}
