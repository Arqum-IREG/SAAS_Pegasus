import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;

  // ht: https://github.com/remix-run/react-router/discussions/9628#discussioncomment-5555901
  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = `${error.statusText}${error.data ? ": " + error.data : ""}`
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }
  return (
    <div className="flex justify-center items-center h-screen m-8">
      <div className="flex flex-col gap-y-12">
        <div>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{errorMessage}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
