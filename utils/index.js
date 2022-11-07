import { ethers } from "ethers";

export async function getContract(address, abi, signer) {
  const tokenContract = new ethers.Contract(address, abi, signer);

  return tokenContract;
}

export async function getContractInfo(tokenContract) {
  const contributionCount = await tokenContract.contributionCount();

  return { contributionCount: Number(contributionCount) };
}

// //#######################################
// export function getMerkleProof(address) {
//   const hashedAddresses = whiteListJson.map((addr) => keccak256(addr));
//   const merkleTree = new MerkleTree(hashedAddresses, keccak256, {
//     sortPairs: true,
//   });
//   const hashedAddress = keccak256(address);
//   const proof = merkleTree.getHexProof(hashedAddress);
//   return proof;
// }

// export async function getContractInfo(contract) {
//   let presaleStart = await contract.presaleStart();
//   let presaleEnd = await contract.presaleEnd();
//   let publicStart = await contract.publicStart();
//   const maxCount = await contract.PRESALE_MAX_PER_TX();

//   return {
//     presaleStart,
//     presaleEnd,
//     publicStart,
//     maxCount,
//   };
// }

// export async function getPresalePrice(contract) {
//   const presalePriceBigNum = await contract.PRESALE_PRICE();
//   const presalePrice = ethers.utils.formatEther(presalePriceBigNum);
//   return presalePrice;
// }

// export async function getPublicPrice(publicStart, now, contract) {
//   const DUTCH_AUCTION_START_PRICE = await contract.DUTCH_AUCTION_START_PRICE();
//   const DUTCH_AUCTION_END_PRICE = await contract.DUTCH_AUCTION_END_PRICE();
//   const DUTCH_AUCTION_LENGTH = await contract.DUTCH_AUCTION_LENGTH();
//   const start_price = ethers.utils.formatEther(DUTCH_AUCTION_START_PRICE);
//   const end_price = ethers.utils.formatEther(DUTCH_AUCTION_END_PRICE);
//   const auction_length = DUTCH_AUCTION_LENGTH;
//   if (now <= publicStart) return start_price;

//   const elapsed = now - publicStart;
//   if (DUTCH_AUCTION_LENGTH < elapsed) {
//     console.log("end_price", end_price);
//     return end_price;
//   } else {
//     console.log("price", price);
//     const price =
//       start_price - (elapsed * (start_price - end_price)) / auction_length;
//     return price;
//   }
// }

// export async function getCurrentSupply() {
//   let provider = new ethers.providers.JsonRpcProvider(RPC_URL);
//   // const now = (await provider.getBlock()).timestamp
//   // console.log('now ' + now)
//   const tokenContract = new ethers.Contract(NFT_ADDRESS, ContractAbi, provider);

//   const totalSupply = await tokenContract.totalSupply(0);
//   return parseInt(totalSupply) - 112;
// }

// export async function getMaxSupply() {
//   let provider = new ethers.providers.JsonRpcProvider(RPC_URL);
//   const tokenContract = new ethers.Contract(NFT_ADDRESS, ContractAbi, provider);

//   const maxSupply = await tokenContract.MAX_SUPPLY();
//   return parseInt(maxSupply) - 112;
// }
