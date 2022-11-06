import { useContext } from "react";
import { Web3ModalContext } from "contexts/Web3ModalProvider";

// styles
import styles from "./index.module.scss";

const WalletButton = () => {
  const { connect, disconnect, account, connected, signer } =
    useContext(Web3ModalContext);

  const handleConnect = async () => {
    await connect();
  };

  return (
    <button
      className={styles.container}
      onClick={() => (connected ? disconnect() : handleConnect())}
    >
      {connected
        ? account.slice(0, 6) + "..." + account.slice(-4)
        : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;
