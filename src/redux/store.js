import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import authAdminReducer from "./authSliceAdmin";
import cartReducer from "./cartSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist config for auth slice only
const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["authAdmin"], // Exclude authAdmin from persistence
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // Apply persist config to auth slice
  cart: cartReducer,
  authAdmin: authAdminReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["authAdmin"], // Exclude authAdmin from persistence
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
