import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getErrorMassage, handleError, handlePending } from 'common/helpers';
import { handlePaginationDataFormatter } from 'redux/helpers';
import { TProductParameterState } from 'redux/types';
import { ParameterService, parametersRespons } from 'swagger/services';

export const fetchProducusParameters = createAsyncThunk<
  parametersRespons,
  { variantId?: string; key?: string; value?: string },
  { rejectValue: string }
>(
  'parameters/fetchProductsParameters',
  async function (
    payload,
    { rejectWithValue },
  ): Promise<parametersRespons | any> {
    try {
      return await ParameterService.getParameters(payload);
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

const initialState: TProductParameterState = {
  parameters: [],
  loading: false,
};

const productsParametersSlicer = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    clearProductsParameters(state) {
      state.parameters = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchProducts
      .addCase(fetchProducusParameters.pending, handlePending)
      .addCase(fetchProducusParameters.fulfilled, (state, action) => {
        state.parameters = handlePaginationDataFormatter(action);
        state.loading = false;
      })
      .addCase(fetchProducusParameters.rejected, handleError);
  },
});

export const { clearProductsParameters } = productsParametersSlicer.actions;

export default productsParametersSlicer.reducer;
