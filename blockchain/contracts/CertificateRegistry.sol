// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateRegistry {
    address public owner;
    
    // Store certificate hashes issued by clubs
    mapping(bytes32 => bool) public certificateHashes;

    event HashStored(bytes32 indexed hash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can store hashes");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Called by clubs/issuers to register a valid certificate hash
    function storeCertificateHash(bytes32 hash) external onlyOwner {
        require(!certificateHashes[hash], "Hash already registered");
        certificateHashes[hash] = true;
        emit HashStored(hash);
    }

    // Publicly verifies if a hash is registered
    function verifyCertificate(bytes32 hash) external view returns (bool) {
        return certificateHashes[hash];
    }
}
