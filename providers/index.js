import { Provider as StoreProvider } from "react-redux";
import store from "store";

export default function Providers({ children }) {
  return <StoreProvider store={store}>{children}</StoreProvider>;
}
