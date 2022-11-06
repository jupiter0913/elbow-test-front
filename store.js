import { createStore } from "redux"

const initialState = {
  provider: null,
  web3Provider: null,
  signer: null,
  address: null,
  chainId: null,
  etheriumPrice: null,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
