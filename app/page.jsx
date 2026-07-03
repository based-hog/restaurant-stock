"use client";

import { useState, useEffect } from "react";
import { sendData } from "../lib/api";

export default function Home() {
  const [mode, setMode] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("Порча");
  const [products, setProducts] = useState([]);
  useEffect(() => {
  fetch("https://script.google.com/macros/s/AKfycbyKRbhrdqYlY9-kY1HMhP5M9F687i4ye52HHXL7ipq3Uqj168xJsEjtKItvFNpH12rXlA/exec?action=products")
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch(console.error);
}, []);
  
  async function submit() {
  if (!products.includes(product)) {
  alert("Такого товара нет в базе.");
  return;
}
  if (!product || !amount) {
    alert("Заполните все поля");
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

  }
  catch (error) {
  alert(error.message);
}
}

  return (
    <main style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Учет склада</h1>

      {!mode && (
        <>
          <button onClick={() => setMode("Приход")}>Приход</button>

          <br />
          <br />

          <button onClick={() => setMode("Списание")}>Списание</button>
        </>
      )}

      {mode && (
        <>
          <h2>{mode}</h2>

         <input
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

          <br />
          <br />

          <input
            type="number"
            placeholder="Количество"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <br />
          <br />

          {mode === "Списание" && (
            <>
              <select
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

              <br />
              <br />
            </>
          )}

          <button onClick={submit}>Отправить</button>

          <br />
          <br />

          <button onClick={() => setMode("")}>Назад</button>
        </>
      )}
    </main>
  );
}