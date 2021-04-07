const GiveToken = artifacts.require('GiveToken.sol')
const Daanam = artifacts.require('Daanam.sol')

module.exports = async function(deployer) {
  // Deploy Give Token
  await deployer.deploy(GiveToken)
  const giveToken = await GiveToken.deployed()

  // Deploy Daanam Contract
  await deployer.deploy(
    Daanam,
    giveToken.address,
    process.env.DEV_ADDRESS, // Your address where you get give tokens - should be a multisig
    web3.utils.toWei(process.env.TOKENS_PER_BLOCK), // Number of tokens rewarded per block, e.g., 100
    process.env.START_BLOCK, // Block number when token mining starts
    process.env.BONUS_END_BLOCK // Block when bonus ends
  )

  // Make Daanam contract token owner
  const daanam = await Daanam.deployed()
  await giveToken.transferOwnership(daanam.address)

  // Add Liquidity pool for rewards, e.g., "ETH/DAI Pool"
  await daanam.add(
    process.env.ALLOCATION_POINT,
    process.env.LP_TOKEN_ADDRESS,
    false
  )

  // Add more liquidity pools here upon deployment, or add them later manually
}
