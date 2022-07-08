import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getErrorMassage,
  handleChangePending,
  handlePending,
  handleError,
  handleChangeError,
} from '../../common/helpers';
import { openSuccessNotification } from 'common/helpers/openSuccessNotidication.helper';
import { TColorState } from 'redux/types';
import { Color, ColorService } from 'swagger/services';
import { PayloadColor } from 'common/interfaces/payload-color.interface';

export const fetchColors = createAsyncThunk<
  Color[],
  undefined,
  { rejectValue: string }
>(
  'colors/fetchColors',
  async function (_, { rejectWithValue }): Promise<any> {
    try {
      return await ColorService.getColors();
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

export const fetchChosenColor = createAsyncThunk<
  Color,
  string,
  { rejectValue: string }
>(
  'colors/fetchChosenColor',
  async function (id, { rejectWithValue }): Promise<any> {
    try {
      return await ColorService.findColorById({ colorId: id });
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

export const createColor = createAsyncThunk<
  Color,
  PayloadColor,
  { rejectValue: string }
>(
  'colors/createColor',
  async function (payload: PayloadColor, { rejectWithValue }): Promise<any> {
    try {
      return await ColorService.createColor({
        body: {
          name: payload.name,
          url: payload.url,
          code: payload.code.hex,
        }
      });
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

export const editColor = createAsyncThunk<
  Color,
  PayloadColor,
  { rejectValue: string }
>(
  'colors/editColor',
  async function (payload: PayloadColor, { rejectWithValue }): Promise<any> {
    try {
      return await ColorService.updateColor({
        colorId: payload.id as string, body: {
          name: payload.name,
          url: payload.url,
          code: payload.code.hex,
        }
      });
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

export const deleteColor = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'colors/deleteColor',
  async function (id, { rejectWithValue }): Promise<any> {
    try {
      return await ColorService.deleteColor({ colorId: id });
    } catch (error: any) {
      return rejectWithValue(getErrorMassage(error.response.status));
    }
  },
);

const initialState: TColorState = {
  colors: [],
  chosenColor: null,
  loading: false,
  saveLoading: false,
};

const colorsSlicer = createSlice({
  name: 'colors',
  initialState,
  reducers: {
    clearColors(state) {
      state.colors = [];
    },
    clearChosenColor(state) {
      state.chosenColor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetchColors
      .addCase(fetchColors.pending, handlePending)
      .addCase(
        fetchColors.fulfilled,
        (state, action) => {
          state.colors = action.payload;
          state.loading = false;
          console.log('fulfilled');
        },
      )
      .addCase(fetchColors.rejected, handleError)
        //fetchColor
      .addCase(fetchChosenColor.pending, handlePending)
      .addCase(
        fetchChosenColor.fulfilled,
        (state, action) => {
          state.chosenColor = action.payload;
          state.loading = false;
          console.log('fulfilled');
        },
      )
      .addCase(fetchChosenColor.rejected, handleError)
        //createColor
      .addCase(createColor.pending, handleChangePending)
      .addCase(
        createColor.fulfilled,
        (state) => {
          state.saveLoading = false;
          openSuccessNotification('Цвет успешно создан');
          console.log('fulfilled');
        },
      )
      .addCase(createColor.rejected, handleChangeError)
        //editColor
      .addCase(editColor.pending, handleChangePending)
      .addCase(editColor.fulfilled, (state, action) => {
        let color = state.colors.find(
          (color) => color.id === action.payload.id,
        );
        color = {
          ...color,
          ...action.payload,
        };
        openSuccessNotification('Цвет успешно обновлен');
        state.saveLoading = false;
        console.log('fulfilled');
      })
      .addCase(editColor.rejected, handleChangeError)
        //deleteColor
      .addCase(deleteColor.pending, handleChangePending)
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.colors = state.colors.filter(
          (item) => item.id !== action.payload,
        );
        state.saveLoading = false;
        openSuccessNotification('Цвет успешно удален');
        console.log('fulfilled');
      })
      .addCase(deleteColor.rejected, handleChangeError);
  },
});

export const { clearColors, clearChosenColor } = colorsSlicer.actions;

export default colorsSlicer.reducer;
