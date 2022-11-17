require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_API_URL = process.env.QUICKNODE_API_URL;
const PRIVATE_KEY_GOERLI = process.env.PRIVATE_KEY_GOERLI;

module.exports = {
  solidity: "0.8.7",
  networks: {
    goerli: {
      url: QUICKNODE_API_URL,
      accounts: [PRIVATE_KEY_GOERLI],
    },
  },
};
// RugHalt address is  0x80fB4fC2A24b878e604C3eB55479109763Ca0D70