// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./libraries/ERC1155.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/IItem.sol";
import "./interfaces/IERC1271.sol";

contract Item is ERC1155, IItem {

    string public override name;
    string public override version;
    
    bytes32 public immutable override DOMAIN_SEPARATOR;

    // keccak256("Permit(address owner,address spender,uint256 nonce,uint256 deadline)");
    bytes32 public constant override PERMIT_TYPEHASH = 0xdaab21af31ece73a508939fedd476a5ee5129a5ed4bb091f3236ffb45394df62;
    
    mapping(address => uint256) public override nonces;

    constructor(
        string memory _name,
        string memory uri,
        string memory _version
    ) ERC1155(uri) {
        name = _name;
        version = _version;

        uint256 chainId; assembly { chainId := chainid() }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(_name)),
                keccak256(bytes(_version)),
                chainId,
                address(this)
            )
        );
    }
    
    function permit(
        address owner,
        address spender,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        require(block.timestamp <= deadline);
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, nonces[owner], deadline))
            )
        );
        nonces[owner] += 1;

        if (Address.isContract(owner)) {
            require(IERC1271(owner).isValidSignature(digest, abi.encodePacked(r, s, v)) == 0x1626ba7e);
        } else {
            address recoveredAddress = ecrecover(digest, v, r, s);
            require(recoveredAddress != address(0));
            require(recoveredAddress == owner);
        }

        _setApprovalForAll(owner, spender, true);
    }
}
