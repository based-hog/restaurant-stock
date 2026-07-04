const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },

  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 24,
  },

  logo: {
    width: 170,
    height: "auto",
  },

  card: {
    maxWidth: 650,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 8px 25px rgba(0,0,0,.08)",
  },

  row: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },

  btn: {
    flex: 1,
    padding: "14px",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },

  inputWrap: {
    position: "relative",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: "14px",
    fontSize: 16,
    border: "1px solid #ddd",
    borderRadius: 12,
    outline: "none",
    boxSizing: "border-box",
  },

  dropdown: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ddd",
    maxHeight: 220,
    overflowY: "auto",
    zIndex: 50,
    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
  },

  item: {
    padding: 14,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },

  cartItem: {
    display: "grid",
    gridTemplateColumns: "50px 1fr 120px",
    gap: 12,
    alignItems: "center",
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 12,
    marginBottom: 10,
    background: "#fafafa",
  },

  remove: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    width: 40,
    height: 40,
    cursor: "pointer",
    fontSize: 18,
  },

  product: {
    fontWeight: 600,
    fontSize: 15,
  },

  qty: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    textAlign: "center",
    fontSize: 16,
  },

  select: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #ddd",
    fontSize: 16,
    marginTop: 18,
  },

  submit: {
    width: "100%",
    marginTop: 24,
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: 15,
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
  },

  toast: {
    position: "fixed",
    left: "50%",
    bottom: 20,
    transform: "translateX(-50%)",
    padding: "12px 20px",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 600,
    zIndex: 1000,
  },
};

export default styles;