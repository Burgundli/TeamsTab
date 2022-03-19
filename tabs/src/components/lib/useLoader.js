import { useEffect, useReducer } from "react";
import { txtToJson } from "./converter";

export function useLoader (promise, options) {
    const { auto } = { auto: true, ...options };
    const [{ data, loading, error }, dispatch] = useReducer(
        ({ data: oldData }, { type, data, error }) => {
          switch (type) {
            case "loading":
              return { data: txtToJson(oldData), loading: true, error: null };
            case "result":
              return { data : txtToJson(data), loading: false, error: null };
            case "error":
              return { data: null, loading: false, error };
            default:
              return {};
          }
        },
        { data: null, loading: !!auto, error: null }
      );
      function load() {
        promise()
          .then((data) => dispatch({ type: "result", data }))
          .catch((error) => dispatch({ type: "error", error }));
      }
      useEffect(() => {
        if (auto) load();
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
      return { data, loading, error, load };

}