"use client";

import { useEffect, useRef, useState } from "react";
import { sendData } from "../lib/api";
import PwaRegister from "./PwaRegister";
import styles from "./styles";

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
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

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

  function addProduct(item) {
    if (cart.find((c) => c.product === item)) return;

    setCart([...cart, { product: item, amount: "" }]);
    setProduct("");
    setFiltered([]);
    setOpen(false);
  }

  function removeItem(index) {
    setCart(cart.filter((_, i) => i !== index));
  }

  function changeAmount(index, value) {
    const copy = [...cart];
    copy[index].amount = value;
    setCart(copy);
  }

  async function submit() {
    if (!cart.length) {
      showToast("Добавьте товары", "error");
      return;
    }

    for (let i of cart) {
      if (!i.amount) {
        showToast(`Введите количество: ${i.product}`, "error");
        return;
      }
    }

    try {
      for (let i of cart) {
        await sendData({
          type: mode,
          product: i.product,
          amount: i.amount,
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
            <div style={styles.inputWrap} ref={wrapRef}>
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
                      onClick={() => addProduct(p)}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.map((item, index) => (
              <div key={index} style={styles.cartItem}>
                <button
                  style={styles.remove}
                  onClick={() => removeItem(index)}
                >
                  ✕
                </button>

                <div style={styles.product}>{item.product}</div>

                <input
                  style={styles.qty}
                  type="number"
                  placeholder="0"
                  value={item.amount}
                  onChange={(e) =>
                    changeAmount(index, e.target.value)
                  }
                />
              </div>
            ))}

            {mode === "Списание" && (
              <select
                style={styles.select}
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

      {toast && (
        <div
          style={{
            ...styles.toast,
            background:
              toast.type === "success" ? "#2ecc71" : "#e74c3c",
          }}
        >
          {toast.message}
        </div>
      )}
    </main>
  );
}