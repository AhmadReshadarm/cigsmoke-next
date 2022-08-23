import TextField from '@mui/material/TextField';
import { InputsTooltip } from '../helpers';
import React from 'react';
import { DetailsRowWrapper, DetailsColumnWrapper } from './common';
import InputMask from 'react-input-mask';
import styled from 'styled-components';

const ReciverData = (props: any) => {
  const { fullName, setFullname, phone, setPhone } = props;
  return (
    <>
      <h3>Данные получателя</h3>
      <DetailsRowWrapper justifycontent="center">
        <DetailsColumnWrapper>
          <label htmlFor="address-reciver-fullname">
            <b>
              <span>Имя и фамилия</span>
              <span className="required">*</span>
            </b>
            <InputsTooltip
              key="address-reciver-fullname-tip"
              title={
                <React.Fragment>
                  <span>Это поле обязательно к заполнению</span>
                </React.Fragment>
              }
            >
              <span className="tool-tip">?</span>
            </InputsTooltip>
          </label>
          <TextField
            id="address-reciver-fullname"
            fullWidth
            label="Имя и фамилия"
            multiline
            rows={1}
            value={fullName}
            defaultValue=""
            onChange={(e) => setFullname(e.target.value)}
          />
        </DetailsColumnWrapper>
      </DetailsRowWrapper>
      <DetailsRowWrapper justifycontent="center">
        <DetailsColumnWrapper>
          <label htmlFor="address-reciver-phone">
            <b>
              <span>Телефон</span>
              <span className="required">*</span>
            </b>
            <InputsTooltip
              key="address-reciver-phone-tip"
              title={
                <React.Fragment>
                  <span>Это поле обязательно к заполнению</span>
                </React.Fragment>
              }
            >
              <span className="tool-tip">?</span>
            </InputsTooltip>
          </label>
          <InputMask
            mask="+7 (999) 999 99 99"
            value={phone}
            disabled={false}
            maskChar=" "
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: '16.5px 14px' }}
          >
            {() => (
              <PhoneField>
                <TextField
                  id="address-reciver-phone"
                  fullWidth
                  label="Телефон"
                  rows={1}
                  defaultValue=""
                />
              </PhoneField>
            )}
          </InputMask>
        </DetailsColumnWrapper>
      </DetailsRowWrapper>
    </>
  );
};

const PhoneField = styled.div`
  display: flex;
  width: 100%;

  .MuiOutlinedInput-root {
    padding: 11.5px 0;
  }
`;

export default ReciverData;