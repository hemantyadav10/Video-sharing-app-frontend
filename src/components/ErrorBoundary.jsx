import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card
            size="3"
            style={{ width: "100%", maxWidth: 448 }}
            className="shadow-lg"
          >
            <Flex direction="column" gap="5" align="center" justify="center">
              {/* Icon */}
              <Flex
                justify="center"
                style={{
                  background: "rgba(239,68,68,0.2)",
                  borderRadius: "9999px",
                  padding: "0.75rem",
                }}
              >
                <AlertCircle size={48} className="text-red-500" />
              </Flex>

              {/* Title */}
              <Text as="h1" size="6" weight="bold" align="center">
                Oops! Something went wrong
              </Text>

              {/* Description */}
              <Text as="p" size="3" color="gray" align="center">
                We encountered an unexpected error. Don&apos;t worry, you can
                try reloading the page or go back to the home page.
              </Text>

              {/* Dev Error Info */}
              {import.meta.env.NODE_ENV === "development" &&
                this.state.error && (
                  <Card variant="surface" color="gray">
                    <Text size="2" color="red" weight="medium" mb="2">
                      {this.state.error.toString()}
                    </Text>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-zinc-500 overflow-auto max-h-32 p-3 bg-zinc-950 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </Card>
                )}

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap justify-center w-full">
                <Button
                  variant="surface"
                  color="gray"
                  onClick={this.handleReload}
                  size={"3"}
                  className="flex-1 text-nowrap"
                >
                  <RefreshCw size={18} /> Reload Page
                </Button>
                <Button
                  color="blue"
                  onClick={this.handleReset}
                  size={"3"}
                  className="flex-1 text-nowrap"
                  highContrast
                >
                  Go Home
                </Button>
              </div>
            </Flex>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
