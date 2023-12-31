import React, { useState, useEffect } from "react";
import { Col, Row, Button, ListGroup, Image, Card, ListGroupItem } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Message from '../components/Message';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function PlaceOrderScreen() {

  const orderCreate = useSelector(state => state.orderCreate)
  const {order, error, success} = orderCreate
  
  const Navigate = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart) 
  cart.itemsPrice =  cart.cartItems.reduce((acc, item) => acc + item.price*item.qty, 0).toFixed(2)
  cart.shippingPrice = Number(cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
  cart.taxPrice = Number((0.082) * cart.itemsPrice).toFixed(2)
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)
  
  if(!cart.paymentMethod){
    Navigate('/payment')
  }

  useEffect(() => {
    if(success){
      Navigate(`/order/${order._id}/`)
      dispatch({ type: ORDER_CREATE_RESET })
    }

  }, [success, Navigate])

  const placeOrder= () =>{
    dispatch(createOrder({
      orderItems:cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice

    }))
  }
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4/>
       <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>
                  Shipping: {cart.shippingAddress.address}, {cart.shippingAddress.city},
                  {'  '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                </strong>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>
                  Method: {cart.paymentMethod}
                </strong>
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? <Message variant='info'>
                Your cart is empty
              </Message>: (
                <ListGroup>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}><Image src={item.image} alt={item.name} fluid rounded/></Col>
                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                        <Col md={4}>{item.qty} X ${item.price} - ${(item.qty*item.price).toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Item:</Col>
                <Col>${cart.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Shipping:</Col>
                <Col>${cart.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Tax:</Col>
                <Col>${cart.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Total:</Col>
                <Col>${cart.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              {error && <Message variant='danger'>{error}</Message>}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems === 0}
                onClick={placeOrder}>
                PLace Order
                </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
       </Row>
    </div>
  )
}

export default PlaceOrderScreen