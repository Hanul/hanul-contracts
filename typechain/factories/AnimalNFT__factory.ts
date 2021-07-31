/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { AnimalNFT } from "../AnimalNFT";

export class AnimalNFT__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<AnimalNFT> {
    return super.deploy(overrides || {}) as Promise<AnimalNFT>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AnimalNFT {
    return super.attach(address) as AnimalNFT;
  }
  connect(signer: Signer): AnimalNFT__factory {
    return super.connect(signer) as AnimalNFT__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AnimalNFT {
    return new Contract(address, _abi, signerOrProvider) as AnimalNFT;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "animals",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405180604001604052806009815260200168105b9a5b585b13919560ba1b8152506040518060400160405280600681526020016510539253505360d21b815250604051806040016040528060018152602001603160f81b815250828281600090805190602001906200008792919062000136565b5080516200009d90600190602084019062000136565b50508151620000b59150600690602084019062000136565b508251602080850191909120825183830120604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f94810194909452830191909152606082015246608082018190523060a08301529060c00160408051601f198184030181529190528051602090910120608052506200021992505050565b8280546200014490620001dc565b90600052602060002090601f016020900481019282620001685760008555620001b3565b82601f106200018357805160ff1916838001178555620001b3565b82800160010185558215620001b3579182015b82811115620001b357825182559160200191906001019062000196565b50620001c1929150620001c5565b5090565b5b80821115620001c15760008155600101620001c6565b600181811c90821680620001f157607f821691505b602082108114156200021357634e487b7160e01b600052602260045260246000fd5b50919050565b608051611b306200023c60003960008181610226015261087e0152611b306000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c806354fd4d50116100b8578063998dd3ca1161007c578063998dd3ca146102b7578063a22cb465146102ca578063b88d4fde146102dd578063c87b56dd146102f0578063d85d3d2714610303578063e985e9c51461031657600080fd5b806354fd4d501461026e5780636352211e1461027657806370a08231146102895780637ac2ff7b1461029c57806395d89b41146102af57600080fd5b806323b872dd116100ff57806323b872dd146101e757806330adf81f146101fa5780633644e5151461022157806342842e0e1461024857806342966c681461025b57600080fd5b806301ffc9a71461013c57806306fdde0314610164578063081812fc14610179578063095ea7b3146101a4578063141a468c146101b9575b600080fd5b61014f61014a3660046117b0565b610352565b60405190151581526020015b60405180910390f35b61016c6103a4565b60405161015b91906118fd565b61018c610187366004611833565b610436565b6040516001600160a01b03909116815260200161015b565b6101b76101b2366004611726565b6104d0565b005b6101d96101c7366004611833565b60076020526000908152604090205481565b60405190815260200161015b565b6101b76101f5366004611632565b6105e6565b6101d97f49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad81565b6101d97f000000000000000000000000000000000000000000000000000000000000000081565b6101b7610256366004611632565b610617565b6101b7610269366004611833565b610632565b61016c610664565b61018c610284366004611833565b6106f2565b6101d96102973660046115e4565b610769565b6101b76102aa366004611750565b6107f0565b61016c610a92565b61016c6102c5366004611833565b610aa1565b6101b76102d83660046116ea565b610b4f565b6101b76102eb36600461166e565b610c14565b61016c6102fe366004611833565b610c4c565b6101d96103113660046117ea565b610d34565b61014f6103243660046115ff565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061038357506001600160e01b03198216635b5e139f60e01b145b8061039e57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600080546103b390611a22565b80601f01602080910402602001604051908101604052809291908181526020018280546103df90611a22565b801561042c5780601f106104015761010080835404028352916020019161042c565b820191906000526020600020905b81548152906001019060200180831161040f57829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b03166104b45760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006104db826106f2565b9050806001600160a01b0316836001600160a01b031614156105495760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084016104ab565b336001600160a01b038216148061056557506105658133610324565b6105d75760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c000000000000000060648201526084016104ab565b6105e18383610d9e565b505050565b6105f03382610e0c565b61060c5760405162461bcd60e51b81526004016104ab90611962565b6105e1838383610f03565b6105e183838360405180602001604052806000815250610c14565b61063b816106f2565b6001600160a01b0316336001600160a01b03161461065857600080fd5b610661816110a3565b50565b6006805461067190611a22565b80601f016020809104026020016040519081016040528092919081815260200182805461069d90611a22565b80156106ea5780601f106106bf576101008083540402835291602001916106ea565b820191906000526020600020905b8154815290600101906020018083116106cd57829003601f168201915b505050505081565b6000818152600260205260408120546001600160a01b03168061039e5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b60648201526084016104ab565b60006001600160a01b0382166107d45760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b60648201526084016104ab565b506001600160a01b031660009081526003602052604090205490565b834211156107fd57600080fd5b6000858152600760208181526040808420805482517f49ecf333e5b8c95c40fdafc95c1ad136e8914a8fb55e9dc8bb01eaa83a2df9ad818601526001600160a01b038d1681850152606081018c90526080810182905260a08082018c90528451808303909101815260c08201855280519086012061190160f01b60e08301527f000000000000000000000000000000000000000000000000000000000000000060e283015261010280830191909152845180830390910181526101229091019093528251928401929092208a86529390925291926001926108df9084906119b3565b90915550600090506108f0876106f2565b9050806001600160a01b0316886001600160a01b0316141561091157600080fd5b803b156109ea57604080516020810186905280820185905260f887901b6001600160f81b0319166060820152815160418183030181526061820192839052630b135d3f60e11b9092526001600160a01b03831691631626ba7e916109799186916065016118e4565b60206040518083038186803b15801561099157600080fd5b505afa1580156109a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c991906117cd565b6001600160e01b031916631626ba7e60e01b146109e557600080fd5b610a7e565b6040805160008082526020820180845285905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610a3e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610a5e57600080fd5b816001600160a01b0316816001600160a01b031614610a7c57600080fd5b505b610a888888610d9e565b5050505050505050565b6060600180546103b390611a22565b60088181548110610ab157600080fd5b600091825260209091200180549091508190610acc90611a22565b80601f0160208091040260200160405190810160405280929190818152602001828054610af890611a22565b8015610b455780601f10610b1a57610100808354040283529160200191610b45565b820191906000526020600020905b815481529060010190602001808311610b2857829003601f168201915b5050505050905081565b6001600160a01b038216331415610ba85760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c65720000000000000060448201526064016104ab565b3360008181526005602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610c1e3383610e0c565b610c3a5760405162461bcd60e51b81526004016104ab90611962565b610c468484848461113e565b50505050565b6000818152600260205260409020546060906001600160a01b0316610ccb5760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b60648201526084016104ab565b6000610ce260408051602081019091526000815290565b90506000815111610d025760405180602001604052806000815250610d2d565b80610d0c84611171565b604051602001610d1d929190611878565b6040516020818303038152906040525b9392505050565b60088054604080516020808201909252848152600183018455600093909352825180519293927ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3850192610d8c9284929101906114be565b505050610d99338261126f565b919050565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610dd3826106f2565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b0316610e855760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084016104ab565b6000610e90836106f2565b9050806001600160a01b0316846001600160a01b03161480610ecb5750836001600160a01b0316610ec084610436565b6001600160a01b0316145b80610efb57506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b0316610f16826106f2565b6001600160a01b031614610f7e5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b60648201526084016104ab565b6001600160a01b038216610fe05760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b60648201526084016104ab565b610feb600082610d9e565b6001600160a01b03831660009081526003602052604081208054600192906110149084906119df565b90915550506001600160a01b03821660009081526003602052604081208054600192906110429084906119b3565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b60006110ae826106f2565b90506110bb600083610d9e565b6001600160a01b03811660009081526003602052604081208054600192906110e49084906119df565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b611149848484610f03565b611155848484846113b1565b610c465760405162461bcd60e51b81526004016104ab90611910565b6060816111955750506040805180820190915260018152600360fc1b602082015290565b8160005b81156111bf57806111a981611a5d565b91506111b89050600a836119cb565b9150611199565b60008167ffffffffffffffff8111156111da576111da611ace565b6040519080825280601f01601f191660200182016040528015611204576020820181803683370190505b5090505b8415610efb576112196001836119df565b9150611226600a86611a78565b6112319060306119b3565b60f81b81838151811061124657611246611ab8565b60200101906001600160f81b031916908160001a905350611268600a866119cb565b9450611208565b6001600160a01b0382166112c55760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f206164647265737360448201526064016104ab565b6000818152600260205260409020546001600160a01b03161561132a5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e7465640000000060448201526064016104ab565b6001600160a01b03821660009081526003602052604081208054600192906113539084906119b3565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60006001600160a01b0384163b156114b357604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906113f59033908990889088906004016118a7565b602060405180830381600087803b15801561140f57600080fd5b505af192505050801561143f575060408051601f3d908101601f1916820190925261143c918101906117cd565b60015b611499573d80801561146d576040519150601f19603f3d011682016040523d82523d6000602084013e611472565b606091505b5080516114915760405162461bcd60e51b81526004016104ab90611910565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610efb565b506001949350505050565b8280546114ca90611a22565b90600052602060002090601f0160209004810192826114ec5760008555611532565b82601f1061150557805160ff1916838001178555611532565b82800160010185558215611532579182015b82811115611532578251825591602001919060010190611517565b5061153e929150611542565b5090565b5b8082111561153e5760008155600101611543565b600067ffffffffffffffff8084111561157257611572611ace565b604051601f8501601f19908116603f0116810190828211818310171561159a5761159a611ace565b816040528093508581528686860111156115b357600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b0381168114610d9957600080fd5b6000602082840312156115f657600080fd5b610d2d826115cd565b6000806040838503121561161257600080fd5b61161b836115cd565b9150611629602084016115cd565b90509250929050565b60008060006060848603121561164757600080fd5b611650846115cd565b925061165e602085016115cd565b9150604084013590509250925092565b6000806000806080858703121561168457600080fd5b61168d856115cd565b935061169b602086016115cd565b925060408501359150606085013567ffffffffffffffff8111156116be57600080fd5b8501601f810187136116cf57600080fd5b6116de87823560208401611557565b91505092959194509250565b600080604083850312156116fd57600080fd5b611706836115cd565b91506020830135801515811461171b57600080fd5b809150509250929050565b6000806040838503121561173957600080fd5b611742836115cd565b946020939093013593505050565b60008060008060008060c0878903121561176957600080fd5b611772876115cd565b95506020870135945060408701359350606087013560ff8116811461179657600080fd5b9598949750929560808101359460a0909101359350915050565b6000602082840312156117c257600080fd5b8135610d2d81611ae4565b6000602082840312156117df57600080fd5b8151610d2d81611ae4565b6000602082840312156117fc57600080fd5b813567ffffffffffffffff81111561181357600080fd5b8201601f8101841361182457600080fd5b610efb84823560208401611557565b60006020828403121561184557600080fd5b5035919050565b600081518084526118648160208601602086016119f6565b601f01601f19169290920160200192915050565b6000835161188a8184602088016119f6565b83519083019061189e8183602088016119f6565b01949350505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906118da9083018461184c565b9695505050505050565b828152604060208201526000610efb604083018461184c565b602081526000610d2d602083018461184c565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b600082198211156119c6576119c6611a8c565b500190565b6000826119da576119da611aa2565b500490565b6000828210156119f1576119f1611a8c565b500390565b60005b83811015611a115781810151838201526020016119f9565b83811115610c465750506000910152565b600181811c90821680611a3657607f821691505b60208210811415611a5757634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415611a7157611a71611a8c565b5060010190565b600082611a8757611a87611aa2565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461066157600080fdfea26469706673582212209ae0f06360a1dbaf1af72f4a4ff52fc222eeca18c59d413df033307937dd48db64736f6c63430008050033";
