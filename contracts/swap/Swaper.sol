/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./interfaces/ISwaper.sol";

contract Swaper is ISwaper {

    address override public feeTo;
    address override public feeToSetter;

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
}
*/