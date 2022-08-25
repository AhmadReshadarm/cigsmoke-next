import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import color from 'components/store/lib/ui.colors';
import { Basket } from 'swagger/services';

const DeliveryTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: color.textPrimary,
    color: color.btnPrimary,
    maxWidth: 400,
    fontSize: theme.typography.pxToRem(14),
    boxShadow: `0px 2px 6px ${color.boxShadowBtn}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '20px',
    borderRadius: '15px',
    padding: '15px',
    userSelect: 'none',
  },
}));

const getFormatedDate = (date: Date): string => {
  const months = {
    1: 'января',
    2: 'февраля',
    3: 'марта',
    4: 'апреля',
    5: 'мая',
    6: 'июня',
    7: 'июля',
    8: 'августа',
    9: 'сентября',
    10: 'октября',
    11: 'ноября',
    12: 'декабря',
  };

  return `${date.getDay()} ${months[date.getMonth()]}`;
};

const getOldPrice = (cart: Basket | null): number => {
  return cart?.orderProducts?.reduce((accum, item) => {
    accum += item.productVariant?.oldPrice ?? item.productPrice!;
    return accum;
  }, 0)!;
};

const getDiscount = (cart: Basket | null) => {
  const oldPrice = getOldPrice(cart);

  const totalAmount = cart?.orderProducts?.reduce((accum, item) => {
    return accum + item.productPrice!;
  }, 0)!;

  return oldPrice - totalAmount;
};

const getTotalPrice = (cart: Basket | null) => {
  const totalAmount = cart?.orderProducts?.reduce((accum, item) => {
    return accum + item.productPrice!;
  }, 0)!;

  return totalAmount + 300;
};

export {
  DeliveryTooltip,
  getFormatedDate,
  getOldPrice,
  getDiscount,
  getTotalPrice,
};
