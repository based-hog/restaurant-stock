"use client";

import { useEffect, useRef, useState } from "react";
import { sendData } from "../lib/api";
import PwaRegister from "./PwaRegister";
import styles from "./styles";

export default function Home() {
  const [mode, setMode] = useState("");

  const [product, setProduct] = useState("");

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);

  const [cart, setCart] = useState([]);

  const [toast, setToast] = useState(null);

  const inputRef = useRef(null);
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
    function outside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", outside);

    return () =>
      document.removeEventListener("mousedown", outside);
  }, []);

  function showToast(message, type = "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  function search(text) {
    setProduct(text);

    if (text.trim() === "") {
      setFiltered([]);
      setOpen(false);
      return;
    }

    const list = products.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );

    setFiltered(list);
    setOpen(true);
  }

  function addProduct(name) {
    if (cart.some((item) => item.product === name)) {
      setProduct("");
      setFiltered([]);
      setOpen(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return;
    }

    setCart((prev) => [
      ...prev,
      {
        product: name,
        amount: "",
      },
    ]);

    setProduct("");
    setFiltered([]);
    setOpen(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }

  function removeProduct(index) {
    setCart((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function changeAmount(index, value) {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, amount: value }
          : item
      )
    );
  }

  async function submit() {
    if (cart.length === 0) {
      showToast(
        "Добавьте хотя бы один товар",
        "error"
      );
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
          date: new Date().toISOString(),
        });
      }

      showToast("Успешно отправлено");

      setCart([]);
      setProduct("");
      setMode("");
      setFiltered([]);
      setOpen(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

    } catch {
      showToast("Ошибка отправки", "error");
    }
  }

  return (
<main style={styles.page}>
  <PwaRegister />

  <div style={styles.logoWrap}>
    <img
      src="/logo.png"
      alt="Хинкальня"
      style={styles.logo}
    />
  </div>
<div
  style={{
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  }}
>
  Товаров: {products.length}
</div>
  <div style={styles.card}>
    <div style={styles.row}>
      <button
        style={{
          ...styles.btn,
          background:
            mode === "Списание"
              ? "#e74c3c"
              : "#eee",
          color:
            mode === "Списание"
              ? "#fff"
              : "#333",
        }}
        onClick={() => setMode("Списание")}
      >
        Списание
      </button>

      <button
        style={{
          ...styles.btn,
          background:
            mode === "Списание штат"
              ? "#3498db"
              : "#eee",
          color:
            mode === "Списание штат"
              ? "#fff"
              : "#333",
        }}
        onClick={() => setMode("Списание штат")}
      >
        Списание штат
      </button>
    </div>

    {mode && (
      <>
        <div
          ref={wrapRef}
          style={styles.inputWrap}
        >
          <input
            ref={inputRef}
            style={styles.input}
            value={product}
            placeholder="Начните вводить товар..."
            autoComplete="off"
            onChange={(e) =>
              search(e.target.value)
            }
            onFocus={() => {
              if (
                product &&
                filtered.length > 0
              ) {
                setOpen(true);
              }
            }}
          />

          {open &&
            filtered.length > 0 && (
              <div style={styles.dropdown}>
                {filtered.map((item) => (
                  <div
                    key={item}
                    style={styles.item}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addProduct(item);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
        </div>

        {cart.map((item, index) => (
          <div
            key={item.product}
            style={styles.cartItem}
          >
            <button
              style={styles.remove}
              onClick={() =>
                removeProduct(index)
              }
            >
              ✕
            </button>

            <div style={styles.product}>
              {item.product}
            </div>

            <input
              type="number"
              style={styles.qty}
              placeholder="0"
              value={item.amount}
              onChange={(e) =>
                changeAmount(
                  index,
                  e.target.value
                )
              }
            />
          </div>
        ))}

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
        ...styles.toast,
        background:
          toast.type === "success"
            ? "#2ecc71"
            : "#e74c3c",
      }}
    >
      {toast.message}
    </div>
  )}
</main>
);
}