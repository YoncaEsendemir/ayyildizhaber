import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import '../style/newsContet.css';

const NewsContent = () => {
  return (
    <Container className="news-content mt-4">
      <Row>
        <Col md={8}>
          <Card className="main-news">
            <Card.Img variant="top" src="https://via.placeholder.com/800x400" />
            <Card.Body>
              <Card.Title className="news-title">Başlık Buraya Gelecek</Card.Title>
              <Card.Text className="news-text">
                Buraya haber içeriği gelecek. İçeriğin özeti veya kısa açıklaması burada yer alabilir.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <div className="sidebar">
            <h4>Son Haberler</h4>
            <ul className="news-list">
              <li><a href="#">Haber 1</a></li>
              <li><a href="#">Haber 2</a></li>
              <li><a href="#">Haber 3</a></li>
              <li><a href="#">Haber 4</a></li>
            </ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsContent;
