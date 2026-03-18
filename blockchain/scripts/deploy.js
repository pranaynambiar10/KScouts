const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying CertificateRegistry contract...\n");

  // Get the deployer's wallet
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH/MATIC\n");

  // Deploy the contract
  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
  const registry = await CertificateRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("✅ CertificateRegistry deployed to:", address);
  console.log("🔗 Owner set to:", deployer.address);
  
  console.log("\n⏳ Pre-storing demo certificate hash (Simulating Club Issuance)...");
  const DEMO_HASH_HEX = "2604f0e29cea16cddc8c3813e46bce21286fada3e136dcc2a291fbbbe1ed43e3";
  const demoHashBytes32 = "0x" + DEMO_HASH_HEX;
  
  const tx = await registry.storeCertificateHash(demoHashBytes32);
  await tx.wait();
  console.log(`🎉 Demo certificate hash [${DEMO_HASH_HEX}] registered successfully on-chain!`);

  console.log("\n⏳ Pre-storing second demo certificate hash...");
  const DEMO_HASH_2_HEX = "6cfd2541685960d06b6a7bf9495dca924c843121647542f19bf1e95a00956186";
  const demoHash2Bytes32 = "0x" + DEMO_HASH_2_HEX;
  const tx2 = await registry.storeCertificateHash(demoHash2Bytes32);
  await tx2.wait();
  console.log(`🎉 Second demo certificate hash [${DEMO_HASH_2_HEX}] registered successfully on-chain!`);

  console.log("\n⏳ Pre-storing Sid's demo certificate hash...");
  const HASH_SID_HEX = "40cf943f32b4bcbbb60c2e52662120f801335abe2e90ff51bc15ed0eb732c809";
  const hashSidBytes32 = "0x" + HASH_SID_HEX;
  const tx3 = await registry.storeCertificateHash(hashSidBytes32);
  await tx3.wait();
  console.log(`🎉 Sid's demo certificate hash [${HASH_SID_HEX}] registered successfully on-chain!`);

  console.log("\n📝 Add this to your backend .env file:");
  console.log(`CONTRACT_ADDRESS=${address}`);

  // Save ABI and address for backend use
  const fs = require("fs");
  const path = require("path");

  const artifact = await hre.artifacts.readArtifact("CertificateRegistry");

  const outputDir = path.join(__dirname, "..", "abi");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Save ABI
  fs.writeFileSync(
    path.join(outputDir, "CertificateRegistry.json"),
    JSON.stringify({ address, abi: artifact.abi }, null, 2)
  );

  console.log("\n📁 ABI + address saved to: blockchain/abi/CertificateRegistry.json");
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
