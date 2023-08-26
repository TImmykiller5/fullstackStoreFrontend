import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'

function Footer() {
  return (
    <footer>
        <Container>
            <Row>
                <Col className='text-center py3 footer'>Copyright &copy; Tshop</Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer