import { useState, useEffect, useCallback } from "react";
import api, { errMsg } from "../api/client";

// Loads GET `url`; returns { data, loading, error, reload, setData }
export function useFetch(url, initial = []) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      setData(res.data);
      setError("");
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const dayKey = (d = new Date()) => new Date(d).toISOString().slice(0, 10);
export const inputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
