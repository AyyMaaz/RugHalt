async function main() {

  const RugHalt = await ethers.getContractFactory("RugHalt");
  const Rug = await RugHalt.deploy();

  await Rug.deployed();
  console.log(`RugHalt address is  ${Rug.address}`);
}
//

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//RugHalt address is  0xc8953976Dc1A3E6BF787e4E4e64775dd4c0FD689