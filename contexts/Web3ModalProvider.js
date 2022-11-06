/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
// import Web3 from "web3"
import { ethers } from "ethers";
import { providerOptions } from "constants/providers";
import { ChainId, ChainUrl } from "constants/chains";
import { toast } from "react-toastify";

let EthereumChainId =
  process.env.REACT_APP_ENV === "development"
    ? ChainId.Rinkeby
    : ChainId.Ethereum;

export const Web3ModalContext = createContext({
  // web3: null,
  ethersInstance: null,
  signer: null,
  connect: () => {},
  disconnect: () => {},
  account: null,
  chainId: null,
  // networkId: null,
  connected: false,
});

let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true,
    providerOptions, // required
    theme: {
      background: "rgb(39, 49, 56)",
      main: "rgb(199, 199, 199)",
      secondary: "rgb(136, 136, 136)",
      border: "rgba(195, 195, 195, 0.14)",
      hover: "rgb(16, 26, 32)",
    },
  });
}

export const Web3ModalProvider = (props) => {
  const [ethersInstance, setEthersInstance] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);

  const resetWeb3 = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setEthersInstance(null);
    setSigner(null);
    setConnected(false);
    setProvider(null);

    toast.warning(`Wallet is not connected!`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 4000,
      closeOnClick: true,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === "function") {
        await provider.disconnect();
      }
      if (provider?.close && typeof provider.close === "function") {
        await provider.close();
      }
      resetWeb3();
    },
    [provider, resetWeb3]
  );

  const switchChain = useCallback(async function () {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + EthereumChainId.toString(16) }], // chainId must be in hexadecimal numbers
      });
      connect();
    } catch ({ code, message }) {
      if (code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + EthereumChainId.toString(16),
                rpcUrl: ChainUrl[EthereumChainId],
              },
            ],
          });
          connect();
        } catch ({ code, message }) {
          disconnect();
        }
      } else {
        disconnect();
      }
    }
  }, []);

  const connect = useCallback(async () => {
    let _provider;
    try {
      _provider = await web3Modal.connect();
      setProvider(_provider);
    } catch (e) {
      disconnect();
      if (e === "Modal closed by user") return;
      toast.warn(
        `Trouble connecting wallet..!! Check if your wallet is unlocked.`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 4000,
          closeOnClick: true,
        }
      );
      return;
    }
    if (_provider === null) {
      disconnect();
      return;
    }

    const ethersProviderInstance = new ethers.providers.Web3Provider(_provider);
    setEthersInstance(ethersProviderInstance);
    // await ethersProviderInstance.send("eth_requestAccounts", [])
    const signer = await ethersProviderInstance.getSigner();
    setSigner(signer);
    const _account = await signer.getAddress().then((address) => {
      return address;
    });

    const _chainId = (await ethersProviderInstance.getNetwork()).chainId;
    if (_chainId !== EthereumChainId) {
      toast.warn(`Please connect to Ethereum Network`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 4000,
        closeOnClick: true,
      });
      // disconnect();
      await switchChain();
      return;
    }
    toast.success(`Connected to Ethereum Network`, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 4000,
      closeOnClick: true,
    });
    setAccount(String(_account));
    setChainId(_chainId);
    setConnected(true);
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
        chainId === EthereumChainId
          ? setAccount(accounts[0])
          : setAccount(null);
      };

      const handleChainChanged = async (_hexChainId) => {
        setChainId(parseInt(_hexChainId, 16));
        if (parseInt(_hexChainId, 16) !== EthereumChainId) {
          toast.warn(`Please change network to Ethereum`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 4000,
            closeOnClick: true,
          });
          await switchChain();
          // disconnect();
          return;
        }
        // toast.success("Connected to Ethereum Network", {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        //   autoClose: 4000,
        //   closeOnClick: true,
        // })
      };

      const handleDisconnect = async (error) => {
        console.log("disconnect", error.message);
        await web3Modal.clearCachedProvider();
        resetWeb3();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
    return () => {};
  }, [provider, disconnect, chainId, resetWeb3]);

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  return (
    <Web3ModalContext.Provider
      value={{
        ethersInstance,
        // web3,
        signer,
        connect,
        disconnect,
        account,
        // networkId,
        chainId,
        connected,
      }}
    >
      {props.children}
    </Web3ModalContext.Provider>
  );
};
