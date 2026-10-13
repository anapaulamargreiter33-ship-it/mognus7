import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink text-bone">
          <p className="font-serif text-2xl">Algo interrompeu o sono. Recarregue a página.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
