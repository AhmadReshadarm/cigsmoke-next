import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import variants from 'components/store/lib/variants';
import color from 'components/store/lib/ui.colors';
import axios from 'axios';
import Arrow from '../../../../assets/arrow.svg';

interface props {
  font_size?: string;
  font_wight?: string;
  padding?: string;
  bg_color?: string;
}
const fake_data = [
  { icon: 'hookah', catName: 'Кальяны' },
  { icon: 'glass', catName: 'Стеклянные курительные трубки' },
  { icon: 'vape', catName: 'Электронные сигареты' },
  { icon: 'liquad', catName: 'Солевая жидкость' },
  { icon: 'holder', catName: 'Пепельницы' },
  { icon: 'cigar', catName: 'Табак' },
];
const Category_comp = (props: any) => {
  const [data, setData] = useState([]);
  const [sub_menu, set_sub_menu] = useState('electronics');
  const [sub_data, set_sub_data] = useState([]);

  useEffect(() => {
    let trimed = sub_menu.trim();
    axios
      .get(`https://fakestoreapi.com/products/category/${trimed}`)
      .then((res) => {
        set_sub_data(res.data);
      });
  }, [sub_menu]);

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products/categories')
      .then((res) => setData(res.data));
    axios
      .get('https://fakestoreapi.com/products/category/jewelery')
      .then((res) => {
        set_sub_data(res.data);
      });
    const body: any = document.getElementById('__next');
    body.addEventListener('click', (event: any) => {
      const category_wrapper: any = document.getElementById('category-wrapper');
      const category_btn: any = document.getElementById('category-btn');
      if (
        event.target !== category_wrapper &&
        !category_wrapper.contains(event.target) &&
        event.target !== category_btn &&
        !category_btn.contains(event.target)
      ) {
        props.setOpen(false);
        setTimeout(() => props.setDisplay('none'), 150);
      }
    });

    return () => {
      body.removeEventListener('click', () => console.log('removed'));
    };
  }, []);
  return (
    <Wrapper
      id="category-wrapper"
      style={{ display: props.display }}
      animate={props.isOpen ? 'open' : 'close'}
      variants={variants.fadeInReveal}
    >
      <Wrapper_grid>
        <Wrapper_menu padding="0" bg_color={color.bgProduct}>
          {data.map((item, index) => {
            return (
              <Link key={index} href="/">
                <a>
                  <AnimatePresence>
                    <Row_flex
                      onHoverStart={() => set_sub_menu(item)}
                      key={index}
                      custom={index * 0.2}
                      initial={false}
                      animate={props.isOpen ? 'animate' : 'exit'}
                      variants={variants.fadInSlideUp}
                      font_size="1rem"
                      font_wight="600"
                      padding="15px 20px"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 1 }}
                    >
                      <Image
                        src={`/static/temp/${fake_data[index].icon}.svg`}
                        width="20"
                        height="20"
                      />
                      <span id="main-category">{item}</span>
                      <span>
                        <Arrow />
                      </span>
                    </Row_flex>
                  </AnimatePresence>
                </a>
              </Link>
            );
          })}
        </Wrapper_menu>
        <Wrapper_menu padding="20px 0" bg_color={color.textPrimary}>
          {sub_data.map((item: any, index) => {
            return (
              <Link key={index} href="/">
                <a>
                  <AnimatePresence>
                    <Row_flex
                      key={index}
                      custom={index * 0.4}
                      initial={false}
                      animate={props.isOpen ? 'animate' : 'exit'}
                      variants={variants.fadInSlideUp}
                      font_size="0.875rem"
                      font_wight="400"
                      padding="10px"
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 1 }}
                    >
                      <span>{item.title}</span>
                    </Row_flex>
                  </AnimatePresence>
                </a>
              </Link>
            );
          })}
        </Wrapper_menu>
        <Wrapper_brands>
          {sub_data.map((item: any, index) => {
            return (
              <Link key={index} href="/">
                <AnimatePresence>
                  <motion.a
                    key={index}
                    custom={index * 0.1}
                    initial={false}
                    animate={props.isOpen ? 'animate' : 'exit'}
                    variants={variants.fadInSlideUp}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 1 }}
                  >
                    <li>
                      <img src={item.image} />
                    </li>
                  </motion.a>
                </AnimatePresence>
              </Link>
            );
          })}
        </Wrapper_brands>
      </Wrapper_grid>
    </Wrapper>
  );
};

const Wrapper = styled(motion.div)`
  position: absolute;
  top: 120px;
  left: 0;
  width: 100%;
  height: 400px;
  background-color: ${color.textPrimary};
  box-shadow: 0 0 2px 6px ${color.boxShadow};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Wrapper_grid = styled.nav`
  width: 100%;
  height: 100%;
  display: flex;
  display: grid;
  grid-template-columns: repeat(2, 1fr) 3fr;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 35px;
`;

const Wrapper_menu = styled.ul`
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(p: props) => p.bg_color};
  padding: ${(p: props) => p.padding};
  overflow-y: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    width: 10px;
  }
  a {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
`;

const Row_flex = styled(motion.li)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(p: props) => p.padding};
  span {
    font-size: ${(p: props) => p.font_size};
    font-weight: ${(p: props) => p.font_wight};
  }

  &:hover {
    color: ${color.hover};
    background-color: ${color.textPrimary};
  }
  #main-category {
    width: 100%;
    padding: 0 0 0 15px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
`;

const Wrapper_brands = styled.ul`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  a {
    display: flex;
    flex-directio: row;
    justify-content: center;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 15px;
    }
  }
`;

export default Category_comp;
