require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_API_URL = process.env.QUICKNODE_API_URL;
const PRIVATE_KEY_GOERLI = process.env.PRIVATE_KEY_GOERLI;
const PRIVATE_KEY_POLYGON_MUMBAI = process.env.PRIVATE_KEY_POLYGON_MUMBAI;


//this project is deployed to both ploygon and gorli testnet 

module.exports = {
  solidity: "0.8.7",
  networks: {
    goerli: {
      url: QUICKNODE_API_URL,
      accounts: [PRIVATE_KEY_GOERLI],
    },
  },
};
// Goerli RugHalt address is  0x80fB4fC2A24b878e604C3eB55479109763Ca0D70

module.exports = {
  solidity: '0.8.7',
  networks: {
    mumbai: {
      url: QUICKNODE_API_URL,
      accounts: [PRIVATE_KEY_POLYGON_MUMBAI],
    },
  },
};

//Mumbai RugHalt address is  0xD56CF16EB41CcdF213C92Ed6a41A9966aEb7184F