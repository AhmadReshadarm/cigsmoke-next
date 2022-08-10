import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from 'common/axios.instance';
import {
  AnalyticsBrand,
  AnalyticsCategory,
  AnalyticsProduct,
  AnalyticsUser,
  DynamicData,
  DynamicUsersData,
} from 'common/interfaces/data-analytics.interfaces';
import { TAnalyticsState } from 'redux/types';
import { AnalyticsService, User } from 'swagger/services';

import { getErrorMassage, handleError, handlePending, openErrorNotification } from '../../common/helpers';

interface AnalyticsStaticPayload {
    groupBy?: string,
    createdFrom?: string,
    createdTo?: string
}

interface AnalyticsDynamicPayload {
    from: string;
    to: string;
    step: string;
}

export const fetchAnalytics = createAsyncThunk<
  { data: AnalyticsCategory[] | AnalyticsBrand[] | AnalyticsProduct[] | AnalyticsUser[]},
  AnalyticsStaticPayload,
  { rejectValue: string }
>(
  'analytics/fetchAnalytics',
  async function (payload: AnalyticsStaticPayload, { rejectWithValue }): Promise<any> {
    try {
      return await AnalyticsService.getAnalytics({
        groupBy: payload?.groupBy});
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

export const fetchDynamicAnalytics = createAsyncThunk<
  DynamicData[],
  AnalyticsDynamicPayload,
  { rejectValue: string }
>(
  'analytics/fetchDynamicAnalytics',
  async function (payload: AnalyticsDynamicPayload, { rejectWithValue }): Promise<any> {
    try {
      return await AnalyticsService.getDynamic({
        from: payload.from,
        to: payload.to,
        step: payload.step
      })
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

export const fetchAnalyticsUsers = createAsyncThunk<
  DynamicUsersData,
  AnalyticsStaticPayload,
  { rejectValue: string }
>(
  'analytics/fetchAnalyticsUsers',
  async function (payload: AnalyticsStaticPayload, { rejectWithValue }): Promise<any> {
    try {
      const resp = await axiosInstance.get(`/analytics/users?createdFrom=${payload.createdFrom}&createdTo=${payload.createdTo}`)
      return resp.data
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

const initialState: TAnalyticsState = {
  analyticsData: [],
  usersData: {},
  loading: false,
};

const analyticsSlicer = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics(state) {
      state.analyticsData = []
      state.usersData = {}
    },
  },
  extraReducers: (builder) => {
    builder
      //Categories
      .addCase(fetchAnalytics.pending, handlePending)
      .addCase(
        fetchAnalytics.fulfilled,
        (state, action) => {
          state.analyticsData = action.payload.data;
          state.loading = false;
          console.log('fulfilled');
        },
      )
      .addCase(fetchAnalytics.rejected, handleError)
      //Dynamic
      .addCase(fetchDynamicAnalytics.pending, handlePending)
      .addCase(
        fetchDynamicAnalytics.fulfilled,
        (state, action) => {
          state.analyticsData = action.payload;
          state.loading = false;
          console.log('fulfilled');
        },
      )
      .addCase(fetchDynamicAnalytics.rejected, handleError)
      //Users
      .addCase(fetchAnalyticsUsers.pending, handlePending)
      .addCase(
        fetchAnalyticsUsers.fulfilled,
        (state, action) => {
          state.usersData = action.payload;
          console.log(state.usersData)
          state.loading = false;
          console.log('fulfilled');
        },
      )
      .addCase(fetchAnalyticsUsers.rejected, handleError)
  },
});

export const { clearAnalytics } = analyticsSlicer.actions;

export default analyticsSlicer.reducer;