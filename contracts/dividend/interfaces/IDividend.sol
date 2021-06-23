// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../../token/interfaces/IFungibleToken.sol";

interface IDividend is IFungibleToken {

    event Distributed(address indexed by, uint256 distributed);
    event Withdrawn(address indexed to, uint256 withdrawn);

    function token() public view returns (IERC20);
    function accumulativeOf(address owner) public view returns (uint256);
    function withdrawnOf(address owner) public view returns (uint256);
    function withdrawableOf(address owner) public view returns (uint256);
    function withdraw() public;
}
