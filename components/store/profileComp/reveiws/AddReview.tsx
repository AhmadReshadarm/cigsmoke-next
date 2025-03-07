import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Rating } from '@mui/material';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import color from 'components/store/lib/ui.colors';
import variants from 'components/store/lib/variants';
import { devices } from 'components/store/lib/Devices';
import { PopupContainer } from '../common';
import { useAppDispatch } from 'redux/hooks';
import { updateReview } from 'redux/slicers/store/profileSlicer';
import { AppDispatch } from 'redux/store';
import { clearImageList } from 'redux/slicers/imagesSlicer';
import { Review } from 'swagger/services';

const AddReview = ({ setOpen, review }) => {
  const dispatch = useAppDispatch();
  const [rate, setRate] = useState(review.rating);
  const [src, setSrc] = useState([]);
  const [input, setInput] = useState(review.text);
  const [success, setSuccess] = useState('');

  const handleDelete = (passed: any) => {
    setSrc(src.filter((item) => item != passed));
  };

  const handleReviewPublish =
    (dispatch: AppDispatch, rating: number, text: string, review: Review) =>
    async (e) => {
      e.preventDefault();
      const payload = {
        ...review,
        rating,
        text,
      };
      await dispatch(updateReview({ reviewId: review.id!, payload }));
      setSuccess('Ваш отзыв опубликован');
      setTimeout(() => {
        setSuccess('');
        setOpen(false);
      }, 1000);
    };

  useEffect(() => {
    return () => {
      dispatch(clearImageList());
    };
  }, []);

  return (
    <PopupContainer>
      <AddReviewContainer
        custom={0}
        initial="init"
        whileInView="animate"
        variants={variants.fadeOutSlideOut}
      >
        <span onClick={() => setOpen(false)} className="close-btn">
          <svg
            width="15"
            height="15"
            viewBox="0 0 21 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1"
              y1="-1"
              x2="26.3541"
              y2="-1"
              transform="matrix(0.683484 -0.729965 0.681649 0.731679 1.52267 21.0312)"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line
              x1="1"
              y1="-1"
              x2="26.3044"
              y2="-1"
              transform="matrix(0.680786 0.732483 -0.684345 0.729158 0.21875 1.03125)"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <StarsWrapper>
          <span>Пожалуйста, оцените этот товар</span>
          <Rating
            value={rate}
            size="medium"
            onChange={(event, newValue: any) => {
              setRate(newValue);
            }}
          />
        </StarsWrapper>
        <form>
          <span>Пожалуйста, напишите комментарий об этом товаре</span>
          <TextField
            fullWidth
            label="Комментарий"
            multiline
            rows={4}
            value={input}
            defaultValue=""
            onChange={(e) => setInput(e.target.value)}
          />
          <motion.button
            whileHover={{ boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.25)' }}
            whileTap={{ boxShadow: '0px 0px 0px 0px #ffffff' }}
            custom={0}
            animate={input.length == 0 ? 'init' : 'animate'}
            variants={variants.fadeOutSlideOut}
            style={{ display: input.length == 0 ? 'none' : 'flex' }}
            onClick={handleReviewPublish(dispatch, rate, input, review)}
          >
            <span>Опубликовать обзор</span>
            <span>
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.8107 11.3975L11.7704 17.7666C11.9827 18.5159 12.26 19.1221 12.6002 19.5382C12.9426 19.9569 13.4115 20.2483 13.964 20.1574C14.4828 20.0721 14.8966 19.6734 15.2143 19.164C15.5392 18.643 15.8199 17.9196 16.0452 17.006L20.7918 1.01729C20.8572 0.797135 20.7642 0.560762 20.5663 0.444192C20.4881 0.398121 20.4014 0.375446 20.3153 0.374989C20.2443 0.364174 20.1703 0.368548 20.098 0.39001L4.10819 5.13547C3.19452 5.36068 2.47101 5.64132 1.95002 5.96615C1.44058 6.28378 1.04189 6.69747 0.956497 7.21622C0.865553 7.76871 1.15715 8.23761 1.57583 8.57985C1.9919 8.91994 2.59813 9.19718 3.34748 9.40941L9.8107 11.3975ZM3.63606 8.45194L9.85185 10.3639L18.4551 1.92069L4.38137 6.0975C4.37374 6.09976 4.36607 6.10185 4.35834 6.10374C3.49616 6.31544 2.87978 6.5649 2.47909 6.81472C2.06465 7.07312 1.95939 7.28037 1.94322 7.37865C1.93259 7.4432 1.9418 7.58742 2.20871 7.80559C2.47719 8.02505 2.93935 8.25497 3.625 8.44868L3.62504 8.44855L3.63606 8.45194ZM12.7279 17.478L10.8155 11.2627L19.2611 2.65972L15.0832 16.7327C15.0818 16.7373 15.0805 16.742 15.0792 16.7467C15.0784 16.7497 15.0777 16.7527 15.0769 16.7557C14.8652 17.6178 14.6157 18.2342 14.3658 18.6348C14.1073 19.0492 13.9 19.1545 13.8016 19.1707C13.7369 19.1813 13.5926 19.172 13.3744 18.9052C13.1549 18.6367 12.9249 18.1746 12.7312 17.489L12.7313 17.489L12.7279 17.478Z"
                  fill="white"
                />
              </svg>
            </span>
          </motion.button>
        </form>
        <motion.span
          className="success-review"
          custom={0}
          animate={success.length == 0 ? 'init' : 'animate'}
          variants={variants.fadeOutSlideOut}
        >
          {success}
        </motion.span>
        <PreviewWrapper style={{ display: src.length == 0 ? 'none' : 'grid' }}>
          {src.map((item, index) => {
            return (
              <motion.li
                custom={index * 0.02}
                initial="init"
                whileInView="animate"
                viewport={{ once: true }}
                variants={variants.fadInSlideUp}
                key={index}
              >
                <motion.img
                  custom={index * 0.08}
                  initial="init"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={variants.slideInFromRigh}
                  src={item}
                  alt=""
                />
                <motion.span
                  custom={1.05}
                  whileHover="hover"
                  whileTap="tap"
                  variants={variants.grow}
                  className="delete-wrapper"
                  onClick={() => handleDelete(item)}
                >
                  <span>Удалить</span>
                  <span>
                    <svg
                      width="14"
                      height="18"
                      viewBox="0 0 14 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3.46 8.88L4.87 7.47L7 9.59L9.12 7.47L10.53 8.88L8.41 11L10.53 13.12L9.12 14.53L7 12.41L4.88 14.53L3.47 13.12L5.59 11L3.46 8.88ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z"
                        fill="#ED3969"
                      />
                    </svg>
                  </span>
                </motion.span>
              </motion.li>
            );
          })}
        </PreviewWrapper>
      </AddReviewContainer>
    </PopupContainer>
  );
};

const AddReviewContainer = styled(motion.div)`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${color.textPrimary};
  box-shadow: 0px 2px 6px ${color.boxShadow};
  border-radius: 20px;
  gap: 5px;
  position: relative;
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
  .success-review {
    color: ${color.ok};
  }
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    textarea {
      width: 100%;
    }
    input {
      display: none;
    }
    button {
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      background-color: ${color.btnPrimary};
      color: ${color.textPrimary};
      border-radius: 15px;
      cursor: pointer;
      span {
        display: flex;
      }
    }
  }
  @media ${devices.tabletL} {
    width: 90%;
    .close-btn {
      top: -20px;
      right: 10px;
    }
  }
  @media ${devices.tabletS} {
    width: 90%;
    .close-btn {
      top: -20px;
      right: 10px;
    }
  }
  @media ${devices.mobileL} {
    width: 90%;
    .close-btn {
      top: -20px;
      right: 10px;
    }
  }
  @media ${devices.mobileM} {
    width: 90%;
    .close-btn {
      top: -20px;
      right: 10px;
    }
  }
  @media ${devices.mobileS} {
    width: 90%;
    .close-btn {
      top: -20px;
      right: 10px;
    }
  }
`;

const StarsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
`;

const PreviewWrapper = styled.ul`
  width: 100%;
  height: 125px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  user-select: none;
  padding: 5px;
  li {
    width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    font-size: 0.8rem;
    .delete-wrapper {
      width: 90%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: ${color.hover};
      cursor: pointer;
    }
    img {
      width: 100%;
      border-radius: 10px;
    }
  }
`;

export default AddReview;
