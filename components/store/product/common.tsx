import styled from 'styled-components';
import { motion } from 'framer-motion';
import color from '../lib/ui.colors';
import { styleProps } from '../lib/types';

const HeaderWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  h3 {
    font-family: 'intro';
    font-size: 1.2rem;
    margin: 0;
  }
`;

const SliderImage = styled(motion.img)`
  width: 95%;
  height: 95%;
  position: absolute;
  left: auto;
  top: auto;
  padding: 20px;
  object-fit: contain;
`;

const LoadMoreBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  button {
    width: 200px;
    height: 45px;
    border-radius: 15px;
    background-color: ${color.btnPrimary};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: 'intro';
    color: ${color.textPrimary};
  }
`;

const ReviewContainer = styled.ul`
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
`;

const ReviewReplyWrapper = styled(motion.li)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  padding-left: ${(p: styleProps) => p.padding};
  user-select: none;
`;

const ReviewReplyContent = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  .reply-logo,
  .user-profile-img {
    width: 70px;
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
    font-weight: 800;
    background-color: ${color.btnPrimary};
    color: ${color.textPrimary};
    border-radius: 50%;
    border: 2px solid ${color.textPrimary};
  }
`;

const ReviewReplyItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
  .review-header {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-size: 1.1rem;
      font-family: 'intro';
    }
    .replied-to-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 5px;
      span {
        padding: 10px;
        border-radius: 20px;
        background-color: ${color.btnPrimary};
        color: ${color.textPrimary};
      }
    }
    .date-stars {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      .post-date {
        color: ${color.textSecondary};
      }
    }
  }
  .product-details {
    color: ${color.yellow};
    width: 100%;
    padding: 20px 0;
    font-size: 0.875rem;
  }

  .user-post-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: felx-start;
    gap: 10px;
    h3 {
      font-family: 'intro';
      font-size: 1rem;
    }
  }
`;

const UserImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  div {
    width: 1px;
    height: 100%;
    background-color: ${color.textSecondary};
  }
`;

export {
  HeaderWrapper,
  SliderImage,
  LoadMoreBtnWrapper,
  ReviewContainer,
  ReviewReplyWrapper,
  ReviewReplyContent,
  ReviewReplyItem,
  UserImageWrapper,
};