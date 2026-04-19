import { Container, Button, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"

function RouteNotFound() {
  return (
    <Container className="my-5 text-center">
      <Alert variant="warning" className="p-5">
        <h1 className="display-1 mb-4">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="lead">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
      </Alert>
      <nav aria-label="Error page navigation">
        <Button as={Link} to="/" variant="primary" size="lg" className="me-2">
          Go to Homepage
        </Button>
      </nav>
    </Container>
  )
}

export default RouteNotFound
