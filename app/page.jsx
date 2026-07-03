"use client";

import { useState, useEffect } from "react";
import { sendData } from "../lib/api";

export default function Home() {
  const [mode, setMode] = useState("");
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Порча");

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbyKRbhrdqYlY9-kY1HMhP5M9F687i4ye52HHXL7ipq3Uqj168xJsEjtKItvFNpH12rXlA/exec?action=products"
    )
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

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
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="container">
      <img src="/logo.png" className="logo" alt="Хинкальня" />

      <h1 className="title">Учет склада</h1>

      <div className="card">
        <div className="buttons">
          <button
            className={`modeButton ${
              mode === "Приход" ? "active" : ""
            }`}
            onClick={() => setMode("Приход")}
          >
            Приход
          </button>

          <button
            className={`modeButton ${
              mode === "Списание" ? "active" : ""
            }`}
            onClick={() => setMode("Списание")}
          >
            Списание
          </button>
        </div>

        {mode && (
          <>
            <input
              className="input"
              list="products"
              placeholder="Начните вводить товар..."
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />

            <datalist id="products">
              {products.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>

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

            <button className="submit" onClick={submit}>
              Отправить
            </button>
          </>
        )}
      </div>
    </main>
  );
}