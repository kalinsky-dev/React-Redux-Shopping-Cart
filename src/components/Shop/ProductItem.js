import { useDispatch, useSelector } from 'react-redux';

import Card from '../UI/Card';
import classes from './ProductItem.module.css';
import { cartActions } from '../../store/cart-slice';

const ProductItem = (props) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { id, title, price, description } = props;

  const addToCartHandler = () => {
    const newTotalQuantity = cart.totalQuantity + 1;

    const updatedItems = cart.items.slice(); //create a copy via slice to avoid mutating the original state
    const existingItem = updatedItems.find((item) => item.id === id);
    if (existingItem) {
      const updatedItem = { ...existingItem }; //create a copy via spread operator to avoid mutating the original state
      updatedItem.quantity++;
      updatedItem.totalPrice = updatedItem.totalPrice + price;
      const existingItemIndex = updatedItems.findIndex(
        (item) => item.id === id
      );
      updatedItems[existingItemIndex] = updatedItem;
    } else {
      updatedItems.push({
        id: id,
        price: price,
        quantity: 1,
        totalPrice: price,
        name: title,
      });
    }

    const newCart = {
      totalQuantity: newTotalQuantity,
      items: updatedItems,
    };

    dispatch(cartActions.replaceCart(newCart));
    // dispatch(
    //   cartActions.addItemToCart({
    //     id: id,
    //     title: title,
    //     price: price,
    //   })
    // );

    // and then send Http request
  };

  return (
    <li className={classes.item}>
      <Card>
        <header>
          <h3>{title}</h3>
          <div className={classes.price}>${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
