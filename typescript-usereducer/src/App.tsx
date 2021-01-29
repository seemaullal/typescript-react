import * as React from "react";

interface DadJokeResponse {
  id: string;
  joke: string;
  status: 200;
}

type useFetchDispatchAction = "loading" | "data" | "error";
type UseFetchState = {
  state: useFetchDispatchAction;
  data: DadJokeResponse | null;
  error: { message: string } | null;
};
const JOKE_URL = "https://icanhazdadjoke.com/";

function fetchReducer(
  state: UseFetchState,
  {
    data,
    error,
    type,
  }: {
    data?: DadJokeResponse;
    error?: { message: string };
    type: useFetchDispatchAction;
  }
): UseFetchState {
  switch (type) {
    case "loading":
      return {
        state: "loading",
        data: null,
        error: null,
      };
    case "error":
      if (error) {
        return {
          state: "error",
          data: null,
          error: error,
        };
      }
      break;
    case "data":
      if (data) {
        return {
          state: "data",
          data: data,
          error: null,
        };
      }
      break;
  }
  return state;
}

function useFetch(url: string) {
  const [state, dispatch] = React.useReducer(fetchReducer, {
    state: "loading",
    data: null,
    error: null,
  });

  React.useEffect(() => {
    async function performFetch() {
      try {
        const response = await fetch(url, {
          headers: {
            accept: "application/json",
          },
        });
        const data: DadJokeResponse = await response.json();
        dispatch({ type: "data", data });
      } catch (error) {
        dispatch({ type: "error", error });
      }
    }
    dispatch({ type: "loading" });
    performFetch();
  }, [url]);
  return state;
}

export default function App() {
  const { state, data, error } = useFetch(JOKE_URL);
  if (state === "loading") return <div>Loading...</div>;
  if (state === "error") return <div>Error: {error?.message}</div>;
  if (state === "data") return <div>{data?.joke}</div>;
  throw new Error("This should never happen.");
}
