import styled from 'styled-components';
import { motion } from 'framer-motion';
import color from 'components/store/lib/ui.colors';
import variants from 'components/store/lib/variants';
import { handleConfirmationEmail } from './helpers';
import { useState, useEffect } from 'react';

const UserInfo = (props: any) => {
  const { isVerified } = props;
  const [serverResponse, setServerResponse] = useState(undefined);
  const [counter, setCoutner] = useState(30);
  const [iteration, setItration] = useState(0);
  const [counterStart, setCounterStart] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (counter == 0) {
        setCoutner(30);
        setCounterStart(false);
        return;
      }
      if (counterStart) setCoutner(counter - 1);
    }, 1000);
  }, [counter, counterStart]);
  return (
    <Wrapper>
      <img src="/static/temp/gamer.png" alt="profile" />
      <h1>Rishad Moammadi</h1>
      <span style={{ color: isVerified ? color.textSecondary : color.hover }}>
        email@mail.com
      </span>
      {!isVerified ? (
        <>
          <Err
            initial="init"
            animate="animate"
            variants={variants.fadInSlideUp}
          >
            Ваш аккаунт не подтвержден
          </Err>
          <SendMailBtn
            initial="init"
            animate="animate"
            variants={variants.fadInSlideUp}
            whileHover={{ boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.25)' }}
            whileTap={{ boxShadow: '0px 0px 0px 0px #ffffff' }}
            style={{
              backgroundColor:
                counterStart || iteration > 4 ? color.textSecondary : color.ok,
            }}
            disabled={counterStart || iteration > 4 ? true : false}
            onClick={() => {
              handleConfirmationEmail(setServerResponse);
              setCounterStart(true);
              setItration(iteration + 1);
            }}
          >
            {counterStart
              ? `попробуй еще раз после: ${counter}`
              : 'Отправить мне подтверждение'}
          </SendMailBtn>
        </>
      ) : (
        ''
      )}
      {serverResponse == 200 ? (
        <Ok initial="init" animate="animate" variants={variants.fadInSlideUp}>
          Проверьте свою электронную почту на наличие подтверждающего сообщения
        </Ok>
      ) : (
        ''
      )}
      {serverResponse == 500 ||
      serverResponse == 401 ||
      serverResponse == 403 ? (
        <Err initial="init" animate="animate" variants={variants.fadInSlideUp}>
          что-то пошло не так, нам очень жаль 😢
        </Err>
      ) : (
        ''
      )}
      {serverResponse == 429 && iteration > 5 ? (
        <Err>Слишком много запросов повторите попытку через 24 часа</Err>
      ) : (
        ''
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  img {
    width: 60px;
    border-radius: 60%;
  }
  h1 {
    font-family: 'intro';
    font-size: 1.5rem;
  }
`;

const Err = styled(motion.span)`
  color: ${color.hover};
`;

const SendMailBtn = styled(motion.button)`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  color: ${color.textPrimary};
  background-color: ${color.ok};
  font-family: 'intro';
`;
const Ok = styled(motion.span)`
  color: ${color.ok};
`;

export default UserInfo;
