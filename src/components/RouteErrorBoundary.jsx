import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { AlertCircle, RefreshCw } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  const handleReload = () => window.location.reload();
  const handleReset = () => (window.location.href = "/");

  if (isRouteErrorResponse(error)) {
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

            {/* HTTP Status Title */}
            <Text as="h1" size="6" weight="bold" align="center">
              {error.status} {error.statusText || "Error"}
            </Text>

            {/* HTTP Error Description */}
            <Text as="p" size="3" color="gray" align="center">
              {error.data?.message || "Something went wrong with this page."}
            </Text>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 flex-wrap justify-center w-full">
              <Button
                variant="surface"
                color="gray"
                onClick={handleReload}
                size="3"
                className="flex-1 text-nowrap"
              >
                <RefreshCw size={18} /> Reload Page
              </Button>
              <Button
                color="blue"
                onClick={handleReset}
                size="3"
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
  } else if (error instanceof Error) {
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
              {error.message || "We encountered an unexpected error."}
            </Text>

            {/* Dev Error Info */}
            {import.meta.env.NODE_ENV === "development" && error && (
              <Card variant="surface" color="gray">
                <Text size="2" color="red" weight="medium" mb="2">
                  {error.toString()}
                </Text>
                {error.stack && (
                  <pre className="text-xs text-zinc-500 overflow-auto max-h-32 p-3 bg-zinc-950 rounded">
                    {error.stack}
                  </pre>
                )}
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 flex-wrap justify-center w-full">
              <Button
                variant="surface"
                color="gray"
                onClick={handleReload}
                size="3"
                className="flex-1 text-nowrap"
              >
                <RefreshCw size={18} /> Reload Page
              </Button>
              <Button
                color="blue"
                onClick={handleReset}
                size="3"
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

  // Unknown error
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
            Unknown Error
          </Text>

          {/* Description */}
          <Text as="p" size="3" color="gray" align="center">
            An unexpected error occurred. Don&apos;t worry, you can try
            reloading the page or go back to the home page.
          </Text>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap justify-center w-full">
            <Button
              variant="surface"
              color="gray"
              onClick={handleReload}
              size="3"
              className="flex-1 text-nowrap"
            >
              <RefreshCw size={18} /> Reload Page
            </Button>
            <Button
              color="blue"
              onClick={handleReset}
              size="3"
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
