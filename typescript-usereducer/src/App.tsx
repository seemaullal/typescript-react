import * as React from "react";

type ServerResponse = {
  id: string;
  data: string;
  status: 200;
};

type FetchLoadingAction = {
  type: "loading";
};

type FetchDataAction = {
  type: "data";
  data: ServerResponse;
};

type FetchErrorAction = {
  type: "error";
  error: Error;
};

type FetchState = {
  state: "loading" | "error" | "data";
  data: ServerResponse | null;
  error: Error | null;
};

type FetchActions = FetchDataAction | FetchErrorAction | FetchLoadingAction;
const JOKE_URL = "https://icanhazdadjoke.com/";

function fetchReducer(state: FetchState, action: FetchActions): FetchState {
  switch (action.type) {
    case "loading":
      return {
        state: "loading",
        error: null,
        data: null,
      };
    case "error":
      return {
        state: "error",
        error: action.error,
        data: null,
      };
    case "data":
      return {
        state: "data",
        data: action.data,
        error: null,
      };
  }
}

function useFetch(url: string) {
  const [state, dispatch] = React.useReducer(fetchReducer, {
    state: "loading",
    error: null,
    data: null,
  });

  React.useEffect(() => {
    async function performFetch() {
      try {
        const response = await fetch(url, {
          headers: {
            accept: "application/json",
          },
        });
        const {
          id,
          joke: data,
          status,
        }: { id: string; joke: string; status: 200 } = await response.json();
        dispatch({ type: "data", data: { id, data, status } });
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
  if (state === "data") return <div>{data?.data}</div>;
  throw new Error("This should never happen.");
}
