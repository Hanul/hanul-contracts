// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IEmitter.sol";
import "./EmittableToken.sol";

contract Emitter is Ownable, IEmitter {
    uint256 private constant PRECISION = 1e20;
    
    struct PoolInfo {
        address to;
        uint256 allocPoint;
        uint256 lastEmitBlock;
    }

    IEmittableToken public immutable override token;
    uint256 public immutable override emitPerBlock;
    uint256 public immutable override startBlock;

    PoolInfo[] public override poolInfo;
    uint256 public override totalAllocPoint;

    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _emitPerBlock,
        uint256 _startBlock
    ) {
        token = new EmittableToken(tokenName, tokenSymbol);
        emitPerBlock = _emitPerBlock;
        startBlock = _startBlock;
    }

    function poolCount() external view override returns (uint256) {
        return poolInfo.length;
    }

    function updatePool(uint256 pid) public override {
        PoolInfo storage pool = poolInfo[pid];
        uint256 _lastEmitBlock = pool.lastEmitBlock;
        if (block.number <= _lastEmitBlock) {
            return;
        }
        if (pool.allocPoint == 0) {
            pool.lastEmitBlock = block.number;
            return;
        }
        uint256 amount = (block.number - _lastEmitBlock) * emitPerBlock * pool.allocPoint / totalAllocPoint;
        token.mint(owner(), amount / 10);
        token.mint(pool.to, amount);
        pool.lastEmitBlock = block.number;
    }

    function massUpdatePools() internal {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; pid += 1) {
            updatePool(pid);
        }
    }

    function add(address to, uint256 allocPoint) external onlyOwner {
        massUpdatePools();
        totalAllocPoint += allocPoint;
        poolInfo.push(PoolInfo({
            to: to,
            allocPoint: allocPoint,
            lastEmitBlock: block.number > startBlock ? block.number : startBlock
        }));
        emit Add(to, allocPoint);
    }

    function set(uint256 pid, uint256 allocPoint) external onlyOwner {
        massUpdatePools();
        totalAllocPoint = totalAllocPoint - poolInfo[pid].allocPoint + allocPoint;
        poolInfo[pid].allocPoint = allocPoint;
        emit Set(pid, allocPoint);
    }
}
