import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Create a transformer to clean up persisted data
const cleanUserData = createTransform(
  (inboundState) => {
    // Clean up the state before rehydrating
    return {
      ...inboundState,
      username: inboundState.username?.replace(/"/g, ""),
      id: inboundState.id?.replace(/"/g, ""),
      token: inboundState.token || null,
    };
  },
  (outboundState) => outboundState,
  { whitelist: ["user"] }
);



const persistConfig = {
  key: "root",
  storage,
  transforms: [cleanUserData],

};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer, // Ensure this matches the `user` slice name
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;
export const persistor = persistStore(store);
