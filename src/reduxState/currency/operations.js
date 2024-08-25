import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { exchangeCurrency, latestRates } from "service/exchangeAPI";
import { getUserInfo } from "service/opencagedataApi";

export const fetchBaseCurrency = createAsyncThunk(
  "currency/fetch",
  async (coords, thunkAPI) => {
    const state = thunkAPI.getState();
    const { baseCurrency } = state.currency;
    if (baseCurrency) {
      return thunkAPI.rejectWithValue("We aready have base currency!");
    }
    try {
      const responce = await getUserInfo(coords);
      return responce;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchExchangeCurrency = createAsyncThunk(
  "currency/enchange",
  async (credentials, thunkAPI) => {
    try {
      const responce = await exchangeCurrency(credentials);
      return responce;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchLatestCurrency = createAsyncThunk(
  "currency/latest",
  async (baseCurrency, thunkAPI) => {
    try {
      const responce = await latestRates(baseCurrency);
      return responce;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
