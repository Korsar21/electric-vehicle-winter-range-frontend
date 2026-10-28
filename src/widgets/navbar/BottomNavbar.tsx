
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function BottomNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="bottom">
      <Container className="justify-content-around">
        <Nav.Link as={NavLink} to="/" end>
          Лента
        </Nav.Link>

        <Nav.Link disabled>
          Добавление
        </Nav.Link>

        <Nav.Link as={NavLink} to="/tile">
          Плитка
        </Nav.Link>

        <Nav.Link disabled>
          Вход
        </Nav.Link>
      </Container>
    </Navbar>
  );
}
