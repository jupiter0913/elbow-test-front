import Providers from "providers";
import { Web3ModalProvider } from "contexts/Web3ModalProvider";

// styles
import "assets/scss/global.scss";

function MyApp({ Component, pageProps }) {
  return (
    <Web3ModalProvider>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </Web3ModalProvider>
  );
}

export default MyApp;
