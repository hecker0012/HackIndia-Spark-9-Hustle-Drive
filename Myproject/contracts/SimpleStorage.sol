// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    mapping(uint256 => string) private messages;

    function setMessage(uint256 index, string memory message) public {
        messages[index] = message;
    }

    function getMessage(uint256 index) public view returns (string memory) {
        return messages[index];
    }
}

