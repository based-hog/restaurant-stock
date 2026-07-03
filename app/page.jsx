"use client";

import { useState, useEffect, useRef } from "react";
import { sendData } from "../lib/api";

export default function Home() {
  const [mode, setMode] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Порча");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyKRbhrdqYlY9-kY1HMhP5M9F687i4ye52HHXL7ipq3Uqj168xJsEjtKItvFNpH12rXlA/exec?action=products"
    )
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  function searchProduct(value) {
    setProduct(value);

    if (!value) {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }

    const result = products.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(result);
    setShowDropdown(true);
  }

  function selectProduct(item) {
    setProduct(item);
    setShowDropdown(false);
  }

  async function submit() {
    if (!product || !amount) {
      alert("Заполните все поля");
      return;
    }

    if (!products.includes(product)) {
      alert("Такого товара нет в базе.");
      return;
    }

    try {
      const result = await sendData({
        type: mode,
        product,
        amount,
        reason: mode === "Списание" ? reason : "",
        date: new Date().toISOString(),
      });

      alert(result.message || "Успешно");

      setProduct("");
      setAmount("");
      setReason("Порча");
      setMode("");
      setShowDropdown(false);

    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="container">

      <img
        src="/logo.png"
        className="logo"
        alt="Хинкальня"
      />

      <h1 className="title">
        Учет склада
      </h1>

      <div className="card">

        <div className="buttons">

          <button
            className={`modeButton ${mode === "Приход" ? "active" : ""}`}
            onClick={() => setMode("Приход")}
          >
            Приход
          </button>

          <button
            className={`modeButton ${mode === "Списание" ? "active" : ""}`}
            onClick={() => setMode("Списание")}
          >
            Списание
          </button>

        </div>

        {mode && (
          <>
                      <div style={{ position: "relative" }}>
              <input
                ref={inputRef}
                className="input"
                placeholder="🔍 Начните вводить товар..."
                value={product}
                onChange={(e) => searchProduct(e.target.value)}
                onFocus={() => {
                  if (filteredProducts.length > 0) {
                    setShowDropdown(true);
                  }
                }}
              />

              {showDropdown && filteredProducts.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "60px",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "16px",
                    maxHeight: "220px",
                    overflowY: "auto",
                    boxShadow: "0 10px 25px rgba(0,0,0,.12)",
                    zIndex: 100,
                  }}
                >
                  {filteredProducts.map((item) => (
                    <div
                      key={item}
                      onClick={() => selectProduct(item)}
                      style={{
                        padding: "15px 18px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f2f2f2",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              className="input"
              type="number"
              placeholder="Количество"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {mode === "Списание" && (
              <select
                className="select"
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
              className="submit"
              onClick={submit}
            >
              Отправить
            </button>
          </>
        )}
      </div>
    </main>
  );
}
      