import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import AuthNav from './AuthNav';
import { FaHome, FaCarSide } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AppNavbar() {
  return (
    <BsNavbar
      expand="lg"
      className="navbar navbar-expand-lg py-3 position-sticky top-0"
      style={{
        background: 'rgba(6,10,15,0.92)',
        color: '#fff',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        boxShadow: '0 6px 30px rgba(0,0,0,0.45)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        zIndex: 1100
      }}
    >
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img
            src="/assets/logo-llanta-sv.png"
            alt="LLANTA-SV"
            height="56"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.6))' }}
            className="d-inline-block"
          />
          <span className="fw-bold text-white" style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>
            LLANTA-SV
          </span>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar">
          <i className="fas fa-bars text-light"></i>
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="main-navbar">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link as={Link} to="/" className="nav-link d-flex align-items-center gap-2 text-white">
              <FaHome /> Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/llantas" className="nav-link d-flex align-items-center gap-2 text-white">
              <FaCarSide /> Llantas
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            <AuthNav />
            <a
              className="btn btn-outline-light btn-sm px-3"
              href="https://github.com/mdbootstrap/mdb-ui-kit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
