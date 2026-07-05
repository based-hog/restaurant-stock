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
    <img
      src="/logo.png"
      alt="Хинкальня"
      style={styles.logo}
    />
  </div>

  <div style={styles.card}>
    <div style={styles.row}>
      <button
        style={{
          ...styles.btn,
          background:
            mode === "Списание" ? "#e74c3c" : "#eee",
          color:
            mode === "Списание" ? "#fff" : "#333",
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
          style={styles.inputWrap}
          ref={wrapRef}
        >
          <input
            style={styles.input}
            placeholder="Поиск товара..."
            value={product}
            onChange={(e) =>
              search(e.target.value)
            }
          />

          {open && filtered.length > 0 && (
            <div style={styles.dropdown}>
              {filtered.map((item) => (
                <div
                  key={item}
                  style={styles.item}
                  onClick={() =>
                    addProduct(item)
                  }
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
              value={item.amount}
              placeholder="Количество"
              style={styles.qty}
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