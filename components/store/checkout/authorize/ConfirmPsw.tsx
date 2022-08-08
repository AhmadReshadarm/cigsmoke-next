import React, { useState } from 'react';
import { motion } from 'framer-motion';
import isEmpty from 'validator/lib/isEmpty';
import color from '../../lib/ui.colors';
import variants from '../../lib/variants';
import {
  Content,
  AuthBtns,
  BtnsWrapper,
  AuthInput,
  AuthInputsWrapper,
  FormWrapper,
  ConfidentialityWrapper,
} from './common';
import { handleSignUp } from './helpers';
import { InputsTooltip } from '../helpers';
import PswShow from '../../../../assets/pswshow.svg';
import PswHide from '../../../../assets/pswhide.svg';
import { paginateTo } from '../constant';
const ConfirmPsw = (props: any) => {
  const {
    direction,
    authType,
    paginate,
    setLoading,
    setServerErr,
    firstName,
    lastName,
    email,
    setStep,
    isCap,
    setCap,
  } = props;
  const [psw, setPsw] = useState('');
  const [repeatPsw, setRepeatPsw] = useState('');
  const [confidentiality, setConfidentiality] = useState('password');
  const [secret, setSecret] = useState(0);
  const [[pswInput, repeatPswInput], setInputsErr] = useState([false, false]);
  const payLoad = {
    firstName,
    lastName,
    email,
    password: psw,
    paginate,
    setLoading,
    setServerErr,
    setStep,
  };
  return (
    <Content
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      custom={direction}
      variants={variants.authorizeSlideX}
      animate={authType == 'password' ? 'center' : 'enter'}
    >
      <FormWrapper>
        <h4>Введите свой Логен и Пароль, чтобы войти</h4>
        <AuthInputsWrapper>
          <label htmlFor="signup-psw">
            <b>
              <span>Пароль</span>
              <span className="required">*</span>
            </b>
            <InputsTooltip
              key="psw-tip"
              title={
                <React.Fragment>
                  <span>Это поле обязательно к заполнению</span>
                  <span>
                    Используйте буквенно-цифровые английские символы для пароля
                  </span>
                  <span style={{ color: color.hover }}>
                    минимальное допустимое количество символов восемь
                  </span>
                </React.Fragment>
              }
            >
              <span className="tool-tip">?</span>
            </InputsTooltip>
            <span>{isCap ? 'Капслок включен' : ''}</span>
          </label>
          <AuthInput
            whileHover="hover"
            whileTap="tap"
            variants={variants.boxShadow}
            placeholder={
              isEmpty(psw) && pswInput
                ? 'Пароль не может быть пустым'
                : 'Пароль'
            }
            type={confidentiality}
            id="signup-psw"
            value={psw}
            style={{
              border: `solid 1px ${
                isEmpty(psw) && pswInput ? color.hover : color.btnPrimary
              }`,
            }}
            onChange={(e) => {
              setPsw(e.target.value);
              setInputsErr([true, repeatPswInput ? true : false]);
            }}
            onKeyUp={(e) =>
              setCap(e.getModifierState('CapsLock') ? true : false)
            }
          />
          <ConfidentialityWrapper>
            <span className="content-confidentiality">
              <motion.span
                custom={secret}
                animate={confidentiality == 'password' ? 'show' : 'hide'}
                variants={variants.pswConfidential}
                onClick={() => {
                  setSecret(1);
                  setConfidentiality('text');
                }}
              >
                <PswHide />
              </motion.span>
              <motion.span
                custom={secret}
                animate={confidentiality == 'text' ? 'show' : 'hide'}
                variants={variants.pswConfidential}
                onClick={() => {
                  setSecret(-1);
                  setConfidentiality('password');
                }}
              >
                <PswShow />
              </motion.span>
            </span>
          </ConfidentialityWrapper>
        </AuthInputsWrapper>
        <AuthInputsWrapper>
          <label htmlFor="signup-psw-repeat">
            <b>
              <span>Повторите пароль</span>
              <span className="required">*</span>
            </b>
            <InputsTooltip
              key="psw-tip"
              title={
                <React.Fragment>
                  <span>Это поле обязательно к заполнению</span>
                  <span style={{ color: color.hover }}>
                    повторите тот же пароль сверху
                  </span>
                </React.Fragment>
              }
            >
              <span className="tool-tip">?</span>
            </InputsTooltip>
            <span style={{ color: color.hover, fontSize: '0.6rem' }}>
              {repeatPsw !== psw ? 'пароль не подходит' : ''}
            </span>
          </label>
          <AuthInput
            whileHover="hover"
            whileTap="tap"
            variants={variants.boxShadow}
            placeholder={
              isEmpty(repeatPsw) && repeatPswInput
                ? 'Пароль не может быть пустым'
                : 'Повторите пароль'
            }
            type={confidentiality}
            id="signup-psw-repeat"
            value={repeatPsw}
            style={{
              border: `solid 1px ${
                isEmpty(repeatPsw) && repeatPswInput
                  ? color.hover
                  : color.btnPrimary
              }`,
            }}
            onChange={(e) => {
              setRepeatPsw(e.target.value);
              setInputsErr([pswInput ? true : false, true]);
            }}
            onKeyUp={(e) =>
              setCap(e.getModifierState('CapsLock') ? true : false)
            }
          />
          <ConfidentialityWrapper>
            <span className="content-confidentiality">
              <motion.span
                custom={secret}
                animate={confidentiality == 'password' ? 'show' : 'hide'}
                variants={variants.pswConfidential}
                onClick={() => {
                  setSecret(1);
                  setConfidentiality('text');
                }}
              >
                <PswHide />
              </motion.span>
              <motion.span
                custom={secret}
                animate={confidentiality == 'text' ? 'show' : 'hide'}
                variants={variants.pswConfidential}
                onClick={() => {
                  setSecret(-1);
                  setConfidentiality('password');
                }}
              >
                <PswShow />
              </motion.span>
            </span>
          </ConfidentialityWrapper>
        </AuthInputsWrapper>
      </FormWrapper>
      <BtnsWrapper>
        <AuthBtns
          initial="init"
          whileInView="animate"
          custom={0.05}
          whileHover={{ boxShadow: `0px 0px 4px 2px ${color.boxShadowBtn}` }}
          whileTap={{ boxShadow: `0px 0px 0px 0px ${color.boxShadowBtn}` }}
          variants={variants.fadInSlideUp}
          bgcolor={
            isEmpty(psw) || isEmpty(repeatPsw) || repeatPsw !== psw
              ? color.textSecondary
              : color.btnPrimary
          }
          disabled={
            isEmpty(psw) || isEmpty(repeatPsw) || repeatPsw !== psw
              ? true
              : false
          }
          onClick={() => handleSignUp(payLoad)}
        >
          регистрироваться
        </AuthBtns>
        <AuthBtns
          initial="init"
          whileInView="animate"
          custom={0.1}
          whileHover={{ boxShadow: `0px 0px 4px 2px ${color.boxShadowBtn}` }}
          whileTap={{ boxShadow: `0px 0px 0px 0px ${color.boxShadowBtn}` }}
          variants={variants.fadInSlideUp}
          bgcolor={color.textTertiary}
          onClick={() => {
            paginate(paginateTo.back, 'signup');
            setInputsErr([false, false]);
          }}
        >
          Назад
        </AuthBtns>
      </BtnsWrapper>
    </Content>
  );
};

export default ConfirmPsw;
