"use client";

import { useEffect, useRef, useState } from "react";
import { sendData } from "../lib/api";
import PwaRegister from "./PwaRegister";

export default function Home() {
  const [mode, setMode] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Порча");

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const wrapRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyKRbhrdqYlY9-kY1HMhP5M9F687i4ye52HHXL7ipq3Uqj168xJsEjtKItvFNpH12rXlA/exec?action=products"
    )
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  function search(value) {
    setProduct(value);

    if (!value) {
      setFiltered([]);
      setOpen(false);
      return;
    }

    const res = products.filter((p) =>
      p.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(res);
    setOpen(true);
  }

  function selectItem(item) {
    setProduct(item);
    setOpen(false);
  }

  async function submit() {
    if (!product || !amount) {
      showToast("Заполните все поля", "error");
      return;
    }

    if (!products.includes(product)) {
      showToast("Такого товара нет в базе", "error");
      return;
    }

    try {
      const res = await sendData({
        type: mode,
        product,
        amount,
        reason: mode === "Списание" ? reason : "",
        date: new Date().toISOString(),
      });

      showToast(res.message || "Успешно", "success");

      setProduct("");
      setAmount("");
      setMode("");
      setOpen(false);
    } catch {
      showToast("Ошибка отправки", "error");
    }
  }

  return (
    <main style={styles.page}>
      {/* 🔥 PWA REGISTRATION (ВОТ ТУТ ОН ДОЛЖЕН БЫТЬ) */}
      <PwaRegister />

      {/* LOGO */}
      <div style={styles.logoWrap}>
        <img src="/logo.png" style={styles.logo} />
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <button
            style={{
              ...styles.btn,
              background: mode === "Приход" ? "#2ecc71" : "#eee",
              color: mode === "Приход" ? "#fff" : "#333",
            }}
            onClick={() => setMode("Приход")}
          >
            Приход
          </button>

          <button
            style={{
              ...styles.btn,
              background: mode === "Списание" ? "#e74c3c" : "#eee",
              color: mode === "Списание" ? "#fff" : "#333",
            }}
            onClick={() => setMode("Списание")}
          >
            Списание
          </button>
        </div>

        {mode && (
          <>
            <div ref={wrapRef} style={{ position: "relative" }}>
              <input
                style={styles.input}
                placeholder="Поиск товара..."
                value={product}
                onChange={(e) => search(e.target.value)}
              />

              {open && filtered.length > 0 && (
                <div style={styles.dropdown}>
                  {filtered.map((p) => (
                    <div
                      key={p}
                      style={styles.item}
                      onClick={() => selectItem(p)}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              style={styles.input}
              type="number"
              placeholder="Количество"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {mode === "Списание" && (
              <select
                style={styles.input}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option>Порча</option>
                <option>Отходы</option>
                <option>Ошибка повара</option>
                <option>Ошибка официанта</option>
                <option>Проработки</option>
                <option>Проба</option>
              </select>
            )}

            <button style={styles.submit} onClick={submit}>
              Отправить
            </button>
          </>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.type === "success" ? "#2ecc71" : "#e74c3c",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            zIndex: 9999,
          }}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}

const styles = {
  page: {
    fontFamily: "Arial",
    background: "#f6f7f9",
    minHeight: "100vh",
    padding: 20,
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 15,
  },
  logo: {
    width: 160,
    height: "auto",
  },
  card: {
    maxWidth: 420,
    margin: "0 auto",
    background: "#fff",
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },
  btn: {
    flex: 1,
    padding: 12,
    border: "none",
    borderRadius: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
  },
  dropdown: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 12,
    zIndex: 10,
    maxHeight: 200,
    overflowY: "auto",
  },
  item: {
    padding: 12,
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  submit: {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 12,
    background: "#2ecc71",
    color: "#fff",
    fontSize: 16,
  },
};