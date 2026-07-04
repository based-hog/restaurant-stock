"use client";

import { useEffect, useRef, useState } from "react";
import { sendData } from "../lib/api";
import PwaRegister from "./PwaRegister";

export default function Home() {
  const [mode, setMode] = useState("");

  const [product, setProduct] = useState("");
  const [reason, setReason] = useState("Порча");

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);

  const [cart, setCart] = useState([]);

  const [toast, setToast] = useState(null);

  const wrapRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyKRbhrdqYlY9-kY1HMhP5M9F687i4ye52HHXL7ipq3Uqj168xJsEjtKItvFNpH12rXlA/exec?action=products"
    )
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(console.error);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  function search(value) {
    setProduct(value);

    if (!value) {
      setFiltered([]);
      setOpen(false);
      return;
    }

    const list = products.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(list);
    setOpen(true);
  }

  function addProduct(item) {
    if (cart.find((i) => i.product === item)) {
      setProduct("");
      setFiltered([]);
      setOpen(false);
      return;
    }

    setCart([
      ...cart,
      {
        product: item,
        amount: "",
      },
    ]);

    setProduct("");
    setFiltered([]);
    setOpen(false);
  }

  function removeProduct(index) {
    setCart(cart.filter((_, i) => i !== index));
  }

  function changeAmount(index, value) {
    const copy = [...cart];
    copy[index].amount = value;
    setCart(copy);
  }

  async function submit() {
    if (cart.length === 0) {
      showToast("Добавьте товары", "error");
      return;
    }

    for (const item of cart) {
      if (!item.amount) {
        showToast(
          `Введите количество для "${item.product}"`,
          "error"
        );
        return;
      }
    }

    try {
      for (const item of cart) {
        await sendData({
          type: mode,
          product: item.product,
          amount: item.amount,
          reason: mode === "Списание" ? reason : "",
          date: new Date().toISOString(),
        });
      }

      showToast("Успешно отправлено");

      setCart([]);
      setMode("");
      setProduct("");
    } catch {
      showToast("Ошибка отправки", "error");
    }
  }

  return (
<main style={styles.page}>
  <PwaRegister />

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
        <div
          ref={wrapRef}
          style={{
            position: "relative",
            marginBottom: 20,
          }}
        >
          <input
            style={styles.input}
            placeholder="Поиск товара..."
            value={product}
            onChange={(e) => search(e.target.value)}
          />

          {open && filtered.length > 0 && (
            <div style={styles.dropdown}>
              {filtered.map((item) => (
                <div
                  key={item}
                  style={styles.item}
                  onClick={() => addProduct(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.map((item, index) => (
          <div key={item.product} style={styles.cartItem}>
            <button
              style={styles.delete}
              onClick={() => removeProduct(index)}
            >
              ✕
            </button>

            <div style={styles.productName}>
              {item.product}
            </div>

            <input
              type="number"
              placeholder="0"
              value={item.amount}
              onChange={(e) =>
                changeAmount(index, e.target.value)
              }
              style={styles.qty}
            />
          </div>
        ))}

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

        <button
          style={styles.submit}
          onClick={submit}
        >
          Отправить
        </button>
      </>
    )}
  </div>

  {toast && (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background:
          toast.type === "success"
            ? "#2ecc71"
            : "#e74c3c",
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
    marginBottom: 20,
  },

  logo: {
    width: 170,
    height: "auto",
  },

  card: {
    maxWidth: 450,
    margin: "0 auto",
    background: "#fff",
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  },

  row: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  btn: {
    flex: 1,
    padding: 12,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #ddd",
    fontSize: 16,
    boxSizing: "border-box",
  },

  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 20,
    maxHeight: 220,
    overflowY: "auto",
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  },

  item: {
    padding: 12,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },

  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    background: "#fafafa",
    border: "1px solid #e6e6e6",
    borderRadius: 12,
    padding: 10,
  },

  delete: {
    width: 38,
    height: 38,
    border: "none",
    borderRadius: 10,
    background: "#ff4d4f",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
    flexShrink: 0,
  },

  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 500,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  qty: {
    width: 90,
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    textAlign: "center",
    fontSize: 16,
  },

  submit: {
    width: "100%",
    marginTop: 20,
    padding: 14,
    border: "none",
    borderRadius: 12,
    background: "#2ecc71",
    color: "#fff",
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
  },
};