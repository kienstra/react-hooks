import * as React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if ( this.state.hasError ) {
      return (
          <>
            <div role="alert">
                There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.message}</pre>
            </div>
            { this.props.children }
          </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary
