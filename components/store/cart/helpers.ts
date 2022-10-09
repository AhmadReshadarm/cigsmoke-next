import { OrderProduct } from 'swagger/services';

const getTotalQuantity = (orderProducts: OrderProduct[]) => {
  return orderProducts?.reduce((accum, orderProduct) => {
    return accum + Number(orderProduct.qty);
  }, 0);
};

const getTotalPrice = (orderProducts: OrderProduct[]) => {
  return orderProducts?.reduce((accum, orderProduct) => {
    return accum + Number(orderProduct.qty) * Number(orderProduct.productPrice);
  }, 0);
};

const getTotalDiscount = (orderProducts: OrderProduct[]) => {
  const totalPrice = getTotalPrice(orderProducts);
  const totalOldPrice = orderProducts?.reduce((accum, orderProduct) => {
    return (
      accum +
      Number(orderProduct.qty) * Number(orderProduct.productVariant?.price)
    );
  }, 0);
  return totalPrice - totalOldPrice;
};

const findTotalWheight = (cart: any) => {
  let totalWeight = 0;
  cart?.orderProducts?.map((product: any) =>
    product.product?.parameterProducts?.map((item: any) => {
      if (item.value.match(/(?:^|\W)грамм(?:$|\W)/)) {
        totalWeight =
          totalWeight + parseInt(item.value.match(/\d+/g)) * product.qty;
      }
    }),
  );
  if (totalWeight > 999) {
    totalWeight = 0.001 * totalWeight;
    return { totalWeight, in: 'kilo' };
  }
  return { totalWeight, in: 'gram' };
};

export { getTotalQuantity, getTotalPrice, getTotalDiscount, findTotalWheight };
