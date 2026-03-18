const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
    let registry;
    let owner;
    let otherUser;

    // Example SHA-256 hash (as bytes32)
    const exampleHash = ethers.keccak256(ethers.toUtf8Bytes("test_certificate"));
    const certId = "cert_001";

    beforeEach(async function () {
        [owner, otherUser] = await ethers.getSigners();
        const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
        registry = await CertificateRegistry.deploy();
    });

    it("Should set the owner correctly", async function () {
        expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should store a certificate hash", async function () {
        await registry.storeCertificate(exampleHash, certId);
        const [exists, timestamp, storedId] = await registry.verifyCertificate(exampleHash);
        expect(exists).to.be.true;
        expect(storedId).to.equal(certId);
        expect(timestamp).to.be.greaterThan(0);
    });

    it("Should increment totalCertificates", async function () {
        expect(await registry.totalCertificates()).to.equal(0);
        await registry.storeCertificate(exampleHash, certId);
        expect(await registry.totalCertificates()).to.equal(1);
    });

    it("Should emit CertificateStored event", async function () {
        await expect(registry.storeCertificate(exampleHash, certId))
            .to.emit(registry, "CertificateStored")
            .withArgs(exampleHash, owner.address, certId, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));
    });

    it("Should reject duplicate hash", async function () {
        await registry.storeCertificate(exampleHash, certId);
        await expect(registry.storeCertificate(exampleHash, "cert_002"))
            .to.be.revertedWith("Certificate hash already stored");
    });

    it("Should reject non-owner from storing certificates", async function () {
        await expect(registry.connect(otherUser).storeCertificate(exampleHash, certId))
            .to.be.revertedWith("Only owner can store certificates");
    });

    it("Should return false for unknown hash", async function () {
        const unknownHash = ethers.keccak256(ethers.toUtf8Bytes("unknown"));
        const [exists] = await registry.verifyCertificate(unknownHash);
        expect(exists).to.be.false;
    });
});
