import React, {useState,useEffect,useCallback,useContext} from "react";
import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import Cart from "./components/Cart/Cart";
import CartProvider from "./store/CartProvider";
//import useAlan from "./alan-hook/useAlan";
import {DUMMY_MEALS} from "./components/Meals/AvailableMeals";
import CartContext from "./store/cart-context";
import { cartReducer } from "./store/CartProvider";
import Payment from "./components/Payments/Payment";
import Placed from "./components/Payments/Placed";
import alanBtn from "@alan-ai/alan-sdk-web";

function App() {

  const [cartIsShown, setCartIsShown]= useState(false);
  const [paymentIsShown, setPaymentIsShown]= useState(false);
  const [placedIsShown, setPlacedIsShown]= useState(false);
  
  const showCartHandler=()=>{
    setCartIsShown(true);
  } ;

  const hideCartHandler=()=>{
    setCartIsShown(false);
  };



  const showPaymentHandler=()=>{
    setPaymentIsShown(true);
  } ;

  const hidePaymentHandler=()=>{
    setPaymentIsShown(false);
  };
  const hidePlacedHandler=()=>{
    setPlacedIsShown(false);
  };
//COMMANDS
const COMMANDS ={
  OPEN_CART: 'open-cart',
  CLOSE_CART: 'close-cart',
  ADD_CART:'add-cart',
  REMOVE_CART:'remove-cart',
  TOTAL_AMOUNT:'total-amount',
  PLACE_ORDER:'place-order',
  CLOSE_PAYMENT:'close-payment',
  ORDER_PLACED:'order-placed'
}

const [alanInstance, setAlanInstance]=useState();


const openCart =useCallback(()=> {
  alanInstance.playText("Cart Opened")
  setCartIsShown(true);
},[alanInstance,setCartIsShown])


const closeCart =useCallback(()=> {
  alanInstance.playText("Cart Closed")
  setCartIsShown(false);
},[alanInstance,setCartIsShown])

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
const cartCtx = useContext(CartContext);
const addCart =useCallback(({detail:{name,quantity}})=>{
  const item=DUMMY_MEALS.find(i=>i.name.toLowerCase()===name.toLowerCase())
  if (item==null){
    alanInstance.playText(`${name} is not in the menu` )
  }
  else{
    
    console.log('1');
    const i={
      id: 'amount_'+item.id,
      name: item.name,
      amount: quantity,
      price: item.price,
    };
    cartCtx.addItem(i);
    console.log(cartCtx.addItem,i);
  
////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
    console.log('2');
    alanInstance.playText(`${quantity} ${name} added to the cart`)
  }
},[alanInstance,cartCtx])



const removeCart =useCallback(({detail:{name}})=>{
  console.log('cartctx items',cartCtx.items)
  const item=cartCtx.items.find(i=>i.name.toLowerCase()===name.toLowerCase())
  if (item==null){
    alanInstance.playText(`${name} is not in the menu` )
  }
  else{
    
    const i=item.id;
    console.log('removed id',i);
    cartCtx.removeItem(i);
    alanInstance.playText(`${name} removed from the cart`)
  }


},[alanInstance,cartCtx])

const totalAmount =useCallback(()=> {
  alanInstance.playText(`${cartCtx.totalAmount}`);
},[alanInstance,cartCtx])

const placeOrder =useCallback(()=> {
    setCartIsShown(false)
    alanInstance.playText('Here are your payment options. Pay by Debit card or credit card. Pay by UPI. Pay by cash');
    setPaymentIsShown(true);
},[alanInstance,cartCtx,setPaymentIsShown,setCartIsShown])

const closePayment =useCallback(()=> {
  setPaymentIsShown(false);
},[alanInstance,setPaymentIsShown])

const orderPlaced =useCallback(()=> {
  setPaymentIsShown(false);
  setPlacedIsShown(true);
  alanInstance.playText('Thanks for ordering! Visit again!');
  setTimeout(() => {
    setPlacedIsShown(false);
  }, 5000);
  
},[alanInstance,setPaymentIsShown,setTimeout])



useEffect(()=>{
  window.addEventListener(COMMANDS.OPEN_CART,openCart)
  window.addEventListener(COMMANDS.CLOSE_CART,closeCart)
  window.addEventListener(COMMANDS.ADD_CART,addCart)
  window.addEventListener(COMMANDS.REMOVE_CART,removeCart)
  window.addEventListener(COMMANDS.TOTAL_AMOUNT,totalAmount)
  window.addEventListener(COMMANDS.PLACE_ORDER,placeOrder)
  window.addEventListener(COMMANDS.CLOSE_PAYMENT,closePayment)
  window.addEventListener(COMMANDS.ORDER_PLACED,orderPlaced)


  return () =>{
      window.removeEventListener(COMMANDS.OPEN_CART,openCart)
      window.removeEventListener(COMMANDS.CLOSE_CART,closeCart)
      window.removeEventListener(COMMANDS.ADD_CART,addCart)
      window.removeEventListener(COMMANDS.REMOVE_CART,removeCart)
      window.removeEventListener(COMMANDS.TOTAL_AMOUNT,totalAmount)
      window.removeEventListener(COMMANDS.PLACE_ORDER,placeOrder)
      window.removeEventListener(COMMANDS.CLOSE_PAYMENT,closePayment)
      window.removeEventListener(COMMANDS.ORDER_PLACED,orderPlaced)
  }

},[openCart,closeCart,addCart,removeCart,totalAmount])

useEffect(()=>{

  if(alanInstance!=null) return;

  setAlanInstance(
   alanBtn({
      key:
      "2adf496f322f4108cd6b7151151d911d2e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand:({command,payload})=>{
          window.dispatchEvent(new CustomEvent(command,{detail:payload}))
      }
   })
  )
},[])



  return (
<>

      {cartIsShown && <Cart onClose={hideCartHandler} />}
      <Header onShowCart={showCartHandler} />
      {paymentIsShown && <Payment onClosePayment={hidePaymentHandler}/>}
      {placedIsShown && <Placed />}
      <main>
        <Meals />
      </main>
      </>

  );
}

export default App;
