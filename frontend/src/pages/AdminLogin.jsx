import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function formatApiErrorDetail(detail) {
  if (detail == null) return "Erro inesperado. Tente novamente.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && e.msg) || "").filter(Boolean).join(" ");
  if (detail && detail.msg) return detail.msg;
  return String(detail);
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchLogin(email, password);
      if (data && data.id) navigate("/cozinha/admin/painel");
      else throw new Error("Resposta inesperada");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogin = async (em, pw) => {
    const axios = (await import("axios")).default;
    return axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { email: em, password: pw }, { withCredentials: true });
  };

  const recover = async () => {
    if (!email) {
      setRecoveryMsg("Introduza o seu e-mail e clique novamente.");
      return;
    }
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {});
    setRecoveryMsg("Se o e-mail existir, o link de recuperação será enviado pela MOGNU'S.");
  };

  const inputCls = "w-full rounded-sm border border-inkline bg-ink2 px-4 py-3 text-sm text-bone outline-none placeholder:text-bone/30 focus:border-brass";

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-md border border-inkline bg-ink2/60 p-8"
      >
        <img src="/images/campaign/mognus-logo.png" alt="MOGNU'S" className="mx-auto h-12 w-auto rounded-sm bg-bone p-2" />
        <h1 className="mt-6 text-center font-serif text-3xl font-light text-bone">Painel Privado</h1>
        <p className="mt-1 text-center text-[10px] uppercase tracking-[0.3em] text-bone/40">Acesso restrito · MOGNU'S</p>

        <form onSubmit={submit} className="mt-7 space-y-4" data-testid="admin-login-form">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            data-testid="admin-field-email"
            className={inputCls}
            autoComplete="username"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Palavra-passe"
            data-testid="admin-field-password"
            className={inputCls}
            autoComplete="current-password"
          />
          {error && (
            <p className="rounded-sm border border-red-900/50 bg-red-950/40 px-4 py-3 text-xs text-red-300" data-testid="admin-login-error">
              {error}
            </p>
          )}
          {recoveryMsg && (
            <p className="rounded-sm border border-brass/30 bg-brass/10 px-4 py-3 text-xs text-brass-light" data-testid="admin-recovery-msg">
              {recoveryMsg}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="w-full rounded-full bg-brass px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink transition-colors hover:bg-brass-light disabled:opacity-60"
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
          <button onClick={recover} data-testid="admin-recover" className="text-bone/40 transition-colors hover:text-brass-light">
            Recuperar acesso
          </button>
          <Link to="/cozinha" className="text-bone/40 transition-colors hover:text-brass-light">
            ← Campanha
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
