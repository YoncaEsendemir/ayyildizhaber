import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import {authAdmin} from "../../utils/api";
import "../../style/login.css";

function Login() {
   
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleLogin = async fetch('')

  return (
    <Container className="login-container d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="login-card shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Giriş Yap</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Admin </Form.Label>
                  <Form.Control type="text" placeholder="Admin giriniz" />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control type="password" placeholder="Şifre giriniz" />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Giriş Yap
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
