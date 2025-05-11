import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

function SidebarLayout({ children }) {
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="px-0">
          <Sidebar />
        </Col>
        <Col md={9} lg={10} className="px-3" style={{ height: '100vh' }} >
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default SidebarLayout;

