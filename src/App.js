import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { uiActions } from './store/ui-slice';
import { cartActions } from './store/cart-slice';

let isInitial = true;

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const notification = useSelector((state) => state.ui.notification);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Fetch the existing cart data from the database
  useEffect(() => {
    fetch('https://react-http-51b6e-default-rtdb.firebaseio.com/cart.json')
      .then((response) => {
        // console.log(response);

        if (!response.ok) {
          throw new Error('Fetching cart data failed.');
        }

        return response.json();
      })
      .then((data) => {
        // console.log(data);

        dispatch(
          cartActions.replaceCart({
            items: data.items || [],
            totalQuantity: data.totalQuantity,
          })
        );
      })
      .catch((error) => {
        dispatch(
          uiActions.showNotification({
            status: 'error',
            title: 'Error!',
            message: 'Fetching cart data failed!',
          })
        );
      });
  }, [dispatch]);

  // Override the existing cart data in the database with the latest cart data
  useEffect(() => {
    // With isInitial, I can prevent the useEffect from running on the first render.
    // This is because I don't want to send an HTTP request to the database when the app first loads.
    // I only want to send an HTTP request when the user adds or removes an item from the cart.
    if (isInitial) {
      isInitial = false;
      return;
    }

    // With cart.change, I can prevent the useEffect from running when the user first loads the app.
    if (!cart.change) {
      return;
    }

    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart data!',
      })
    );
    fetch('https://react-http-51b6e-default-rtdb.firebaseio.com/cart.json', {
      method: 'PUT',
      body: JSON.stringify(cart),
    })
      .then((response) => {
        // console.log(response);

        if (!response.ok) {
          throw new Error('Sending cart data failed.');
        }

        dispatch(
          uiActions.showNotification({
            status: 'success',
            title: 'Success!',
            message: 'Sent cart data successfully!',
          })
        );
      })
      .catch((error) => {
        dispatch(
          uiActions.showNotification({
            status: 'error',
            title: 'Error!',
            message: 'Sending cart data failed!',
          })
        );
      });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
