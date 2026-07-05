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