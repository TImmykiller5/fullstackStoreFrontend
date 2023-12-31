import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Row, Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { type } from "@testing-library/user-event/dist/type";
import { getMyOrders } from "../actions/orderActions";


function ProfileScreen() {
  const Location = useLocation();
  const Navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile

  const myOrders = useSelector((state) => state.orderList);
  const { orders, loading:loadingOrders, error: errorOrders } = myOrders

  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin.user;
  useEffect(() => {
    if (!userInfo) {
      Navigate('/login');
    }else{
        if(!user || !user.name || success || userInfo._id !== user._id){
            dispatch({type:USER_UPDATE_PROFILE_RESET})
            dispatch(getUserDetails('profile'))
            dispatch(getMyOrders())
        }else{
            setName(user.name)
            setEmail(user.email)

        }
    }

  }, [user, Navigate, dispatch, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
        setMessage('Passwords Do Not Match')
    } else{
       dispatch(updateUserProfile({
        'id':userInfo._id,
        'name':name,
        'email':email,
        'password':password
       }));
       setMessage('') 
    }
  };

  return (
    <Row>
        <Col md={3}>
            <h2>User Profile</h2>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader/>}
            <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="Email">
          <Form.Label>Email Adress</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Passord</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password Again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        

        <Button type="submit" variant="primary">
          Update
        </Button>
      </Form>
        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? (
              <Loader/>
            ): errorOrders ? (
              <Message variant='danger'>{errorOrders}</Message>
            ):(
              <Table striped responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0 , 10)}</td>
                      <td>${order.totalPrice}</td>
                      <td>{order.isPaid ? order.paidAt.substring(0 , 10) : (
                        <i className="fas fa-times" style={{color:'red'}}></i>
                      )}</td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm">Details</Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen