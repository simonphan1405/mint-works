import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { plansReducer } from "@/features/plans/plansSlice";

const rootReducer = combineReducers({
  plans: plansReducer,
});

export const createAppStore = (preloadedState?: Partial<ReturnType<typeof rootReducer>>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
