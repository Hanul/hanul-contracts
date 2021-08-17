// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./IEmittableToken.sol";

interface IEmitter {

    event Add(address to, uint256 allocPoint);
    event Set(uint256 indexed pid, uint256 allocPoint);

    function token() external view returns (IEmittableToken);
    function emitPerBlock() external view returns (uint256);
    function startBlock() external view returns (uint256);

    function poolCount() external view returns (uint256);
    function poolInfo(uint256 pid) external view returns (
        address to,
        uint256 allocPoint,
        uint256 lastEmitBlock
    );
    function totalAllocPoint() external view returns (uint256);

    function updatePool(uint256 pid) external;
}
