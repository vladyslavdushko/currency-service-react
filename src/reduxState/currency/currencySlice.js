import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBaseCurrency,
  fetchExchangeCurrency,
  fetchLatestCurrency,
} from "./operations";

const initialState = {
  baseCurrency: "",
  isLoading: false,
  isError: null,
  exchangeInfo: null,
  rates: [],
};

const currecySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setBaseCurrency: (state, { payload }) => {
      state.baseCurrency = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchBaseCurrency.fulfilled, (state, { payload }) => {
        state.baseCurrency = payload;
      })
      .addCase(fetchExchangeCurrency.rejected, (state, { payload }) => {
        state.isError = payload;
        state.isLoading = false;
        state.exchangeInfo = null;
      })
      .addCase(fetchExchangeCurrency.fulfilled, (state, { payload }) => {
        state.exchangeInfo = payload;
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(fetchExchangeCurrency.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchLatestCurrency.fulfilled, (state, { payload }) => {
        state.rates = payload;
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(fetchLatestCurrency.pending, (state, { payload }) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchLatestCurrency.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = payload;
        state.rates = [];
      }),
});

export const currecyReducer = currecySlice.reducer;

export const { setBaseCurrency } = currecySlice.actions;
