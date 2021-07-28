// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "../token/FungibleToken.sol";
import "./interfaces/IWETH.sol";

contract WETH is FungibleToken("Wrapped Ether", "WETH", "1"), IWETH {

    receive() external payable {
        deposit();
    }

    function deposit() payable override public {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint value) override external {
        _burn(msg.sender, value);
        payable(msg.sender).transfer(value);
        emit Withdraw(msg.sender, value);
    }
}
