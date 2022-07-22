import color from 'components/store/lib/ui.colors';
import variants from 'components/store/lib/variants';
import { motion } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';
import ArrowRight from '../../../assets/arrow_right.svg';

const Subscription = () => {
  const [promo, setPromo] = useState(false);
  const [news, setNews] = useState(false);

  return (
    <SubscribeContainer
      key="subscribe"
      custom={0.6}
      initial="init"
      whileInView="animate"
      exit="exit"
      viewport={{ once: true }}
      variants={variants.fadInSlideUp}
    >
      <SubscribeWrapper>
        <SubscribeContent>
          <h3>Есть промокод?</h3>
          <form style={{ paddingBottom: '15px' }}>
            <motion.input
              whileHover="hover"
              whileTap="tap"
              variants={variants.boxShadow}
              placeholder="Введите промокод"
            />
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={variants.boxShadow}
              onClick={(e) => {
                e.preventDefault();
                setPromo(!promo);
                setTimeout(() => setPromo(false), 1000);
              }}
            >
              <span>
                <ArrowRight />
              </span>
            </motion.button>
            <motion.span
              id="alert"
              key="promo-messege"
              animate={promo ? 'animate' : 'exit'}
              variants={variants.fadeOutSlideOut}
            >
              Промокод активирован
            </motion.span>
          </form>
          <hr />
          <h3>Подписывайся</h3>
          <span style={{ textAlign: 'center', width: '90%' }}>
            Подписывайтесь на нашу новостную рассылку
          </span>
          <form>
            <motion.input
              whileHover="hover"
              whileTap="tap"
              variants={variants.boxShadow}
              placeholder="Введите Эл. адрес"
            />
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={variants.boxShadow}
              onClick={(e) => {
                e.preventDefault();
                setNews(!news);
                setTimeout(() => setNews(false), 1000);
              }}
            >
              <span>
                <ArrowRight />
              </span>
            </motion.button>
            <motion.span
              id="alert"
              key="promo-messege"
              animate={news ? 'animate' : 'exit'}
              variants={variants.fadeOutSlideOut}
            >
              Вы зарегистрированы
            </motion.span>
          </form>
        </SubscribeContent>
      </SubscribeWrapper>
    </SubscribeContainer>
  );
};

const SubscribeContainer = styled(motion.li)`
  grid-area: subscribe;
  width: 270px;
  height: 450px;
`;

const SubscribeWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const SubscribeContent = styled(motion.div)`
  width: 100%;
  height: 320px;
  background-color: ${color.bgSecondary};
  border-radius: 20px;
  box-shadow: 0px 2px 6px ${color.boxShadow};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 20px 0;
  h3 {
    font-weight: 700;
    font-size: 1.5rem;
    margin: 0;
  }
  form {
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    position: relative;
    input {
      padding: 0 15px;
      height: 35px;
      border: 1px solid ${color.btnPrimary};
      border-radius: 8px;
      background: ${color.bgProduct};
      z-index: 9;
    }
    button {
      width: 35px;
      height: 35px;
      background: ${color.btnPrimary};
      border-radius: 8px;
      span {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }
    #alert {
      position: absolute;
      top: 40px;
      left: 25px;
    }
  }
  hr {
    width: 100%;
    border: 5px solid ${color.bgProduct};
    border-radius: 5px;
  }
`;

export default Subscription;
