import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const STATE_LABELS = {
  novo: "Novo contacto",
  contactado: "Contactado",
  avaliacao: "Em avaliação",
  proposta: "Proposta enviada",
  cliente: "Cliente",
  sem_resposta: "Sem resposta",
  nao_convertido: "Não convertido",
  arquivado: "Arquivado",
};
const STATE_COLORS = {
  novo: "bg-brass/15 text-brass-light",
  contactado: "bg-blue-500/15 text-blue-300",
  avaliacao: "bg-purple-500/15 text-purple-300",
  proposta: "bg-cyan-500/15 text-cyan-300",
  cliente: "bg-green-500/15 text-green-300",
  sem_resposta: "bg-yellow-500/10 text-yellow-300",
  nao_convertido: "bg-red-500/10 text-red-300",
  arquivado: "bg-white/10 text-bone/50",
};

const fmtDate = (d) => (d ? new Date(d).toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" }) : "");

export default function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("metricas");
  const [leads, setLeads] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ days: 14, model: "", lang: "", source: "" });
  const [leadFilters, setLeadFilters] = useState({ q: "", state: "", model: "" });
  const [expanded, setExpanded] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [userMsg, setUserMsg] = useState(null);

  const authGet = useCallback(
    (url) => fetch(url, { credentials: "include" }).then(async (r) => {
      if (r.status === 401) { navigate("/cozinha/admin"); throw new Error("unauth"); }
      return r.json();
    }),
    [navigate]
  );

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((u) => setUser(u))
      .catch(() => navigate("/cozinha/admin"));
  }, [navigate]);

  const loadLeads = useCallback(() => {
    const qs = new URLSearchParams();
    if (leadFilters.state) qs.set("state", leadFilters.state);
    if (leadFilters.model) qs.set("model", leadFilters.model);
    if (leadFilters.q) qs.set("q", leadFilters.q);
    authGet(`${API}/admin/leads?${qs}`).then(setLeads).catch(() => {});
  }, [authGet, leadFilters]);

  const loadMetrics = useCallback(() => {
    const qs = new URLSearchParams({ days: filters.days });
    if (filters.model) qs.set("model", filters.model);
    if (filters.lang) qs.set("lang", filters.lang);
    if (filters.source) qs.set("source", filters.source);
    authGet(`${API}/admin/metrics?${qs}`).then(setMetrics).catch(() => {});
  }, [authGet, filters]);

  const loadUsers = useCallback(() => {
    authGet(`${API}/admin/users`).then(setUsers).catch(() => {});
  }, [authGet]);

  useEffect(() => {
    if (!user) return;
    loadLeads();
    loadMetrics();
    loadUsers();
  }, [user, loadLeads, loadMetrics, loadUsers]);

  const updateLead = async (id, body) => {
    await fetch(`${API}/admin/leads/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    loadLeads();
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    navigate("/cozinha/admin");
  };

  const createUser = async (e) => {
    e.preventDefault();
    setUserMsg(null);
    const r = await fetch(`${API}/admin/users`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (r.ok) {
      setNewUser({ name: "", email: "", password: "" });
      setUserMsg({ ok: true, text: "Conta criada." });
      loadUsers();
    } else {
      setUserMsg({ ok: false, text: (await r.json())?.detail || "Erro ao criar conta." });
    }
  };

  const revokeUser = async (id) => {
    const r = await fetch(`${API}/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    if (!r.ok) setUserMsg({ ok: false, text: (await r.json())?.detail || "Erro." });
    loadUsers();
  };

  const exportCsv = () => {
    window.open(`${API}/admin/leads/export`, "_blank");
  };

  const maxDay = metrics ? Math.max(1, ...metrics.by_day.map((d) => d.visits)) : 1;
  const inputCls = "rounded-sm border border-inkline bg-ink2 px-3 py-2 text-xs text-bone outline-none placeholder:text-bone/30 focus:border-brass";

  if (!user) {
    return <main className="flex min-h-screen items-center justify-center bg-ink"><p className="font-serif text-xl text-bone/60">A carregar…</p></main>;
  }

  return (
    <main className="min-h-screen bg-bone pb-20 pt-24 text-ivory antialiased" data-testid="admin-panel">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <div>
            <h1 className="font-serif text-3xl font-light">Painel · Cozinhas em 15 dias</h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-faint" data-testid="admin-user-email">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/cozinha" className="rounded-full border border-line px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-mute hover:border-brass hover:text-brass-dark">Ver campanha</a>
            <button onClick={logout} data-testid="admin-logout" className="rounded-full bg-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-bone">Terminar sessão</button>
          </div>
        </div>

        <div className="mt-6 flex gap-2" data-testid="admin-tabs">
          {[["metricas", "Métricas"], ["crm", "CRM"], ["utilizadores", "Utilizadores"]].map(([k, label]) => (
            <button
              key={k}
              data-testid={`admin-tab-${k}`}
              onClick={() => setTab(k)}
              className={`rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${tab === k ? "bg-ink text-bone" : "border border-line text-mute hover:text-ivory"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "metricas" && (
          <section className="mt-8" data-testid="admin-metrics">
            <div className="flex flex-wrap gap-3">
              <select value={filters.days} onChange={(e) => setFilters((f) => ({ ...f, days: +e.target.value }))} data-testid="metrics-filter-days" className={inputCls}>
                {[7, 14, 30, 90].map((d) => <option key={d} value={d}>Últimos {d} dias</option>)}
              </select>
              <select value={filters.model} onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))} data-testid="metrics-filter-model" className={inputCls}>
                <option value="">Todos os modelos</option>
                {["Natural", "Contemporânea", "Minimalista", "Clássica moderna", "Urbana", "Sofisticada"].map((m) => <option key={m}>{m}</option>)}
              </select>
              <select value={filters.lang} onChange={(e) => setFilters((f) => ({ ...f, lang: e.target.value }))} data-testid="metrics-filter-lang" className={inputCls}>
                <option value="">Todos os idiomas</option>
                {["pt", "de", "fr", "es"].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="metrics-cards">
              {[
                ["Visitas totais", metrics?.visits_total],
                ["Visitantes únicos", metrics?.visits_unique],
                ["Pedidos recebidos", metrics?.leads_total],
                ["Taxa de conversão", metrics ? `${metrics.conversion}%` : null],
              ].map(([label, value]) => (
                <div key={label} className="rounded-sm border border-line bg-white p-5" data-testid="metrics-card">
                  <p className="font-serif text-4xl text-ivory">{value ?? "—"}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-faint">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-sm border border-line bg-white p-6 lg:col-span-2">
                <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-faint">Visitas e pedidos por dia</h3>
                <div className="mt-5 flex h-40 items-end gap-1.5" data-testid="metrics-by-day">
                  {(metrics?.by_day || []).map((d) => (
                    <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                      <div className="flex w-full items-end justify-center gap-0.5" style={{ height: "120px" }}>
                        <div className="w-2 rounded-t-sm bg-bone2" style={{ height: `${(d.visits / maxDay) * 100}%` }} title={`Visitas: ${d.visits}`} />
                        <div className="w-2 rounded-t-sm bg-brass" style={{ height: `${(d.leads / maxDay) * 100}%` }} title={`Pedidos: ${d.leads}`} />
                      </div>
                      <span className="text-[8px] text-faint">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-sm border border-line bg-white p-5">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-faint">Modelos mais pedidos</h3>
                  <ul className="mt-4 space-y-2" data-testid="metrics-by-model">
                    {(metrics?.by_model || []).slice(0, 6).map((m) => (
                      <li key={m.model} className="flex items-center justify-between text-xs">
                        <span className="text-ivory">{m.model}</span>
                        <span className="text-faint">{m.views} vistas · <strong className="text-brass-dark">{m.leads} pedidos</strong></span>
                      </li>
                    ))}
                    {metrics && metrics.by_model.length === 0 && <li className="text-xs text-faint">Sem dados ainda.</li>}
                  </ul>
                </div>
                <div className="rounded-sm border border-line bg-white p-5">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-faint">Idiomas</h3>
                  <ul className="mt-4 space-y-2" data-testid="metrics-by-language">
                    {(metrics?.by_language || []).map((l) => (
                      <li key={l.lang} className="flex items-center justify-between text-xs">
                        <span className="uppercase text-ivory">{l.lang}</span>
                        <span className="text-faint">{l.count}</span>
                      </li>
                    ))}
                    {metrics && metrics.by_language.length === 0 && <li className="text-xs text-faint">Sem dados ainda.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "crm" && (
          <section className="mt-8" data-testid="admin-crm">
            <div className="flex flex-wrap items-center gap-3">
              <input value={leadFilters.q} onChange={(e) => setLeadFilters((f) => ({ ...f, q: e.target.value }))} placeholder="Pesquisar nome, e-mail, telefone…" data-testid="crm-search" className={`${inputCls} min-w-[220px] flex-1`} />
              <select value={leadFilters.state} onChange={(e) => setLeadFilters((f) => ({ ...f, state: e.target.value }))} data-testid="crm-filter-state" className={inputCls}>
                <option value="">Todos os estados</option>
                {Object.entries(STATE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <button onClick={exportCsv} data-testid="crm-export" className="rounded-full bg-ink px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-bone">Exportar CSV</button>
            </div>

            <div className="mt-5 space-y-3" data-testid="crm-leads">
              {leads.map((l) => (
                <div key={l._id} className="rounded-sm border border-line bg-white p-5" data-testid={`crm-lead-${l._id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-xl text-ivory">{l.name}</p>
                      <p className="mt-1 text-xs text-faint">
                        {l.phone} · {l.email} {l.location ? `· ${l.location}` : ""} · {fmtDate(l.created_at)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {l.model && <span className="rounded-full bg-brass/15 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-brass-dark">{l.model}</span>}
                        <span className="rounded-full bg-bone2 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-mute">{l.language}</span>
                        {l.source && <span className="rounded-full bg-bone2 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-mute">{l.source}</span>}
                        {l.consent && <span className="rounded-full bg-green-500/10 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-green-700">marketing ✓</span>}
                      </div>
                      {l.message && <p className="mt-2 max-w-xl text-xs italic leading-relaxed text-mute">“{l.message}”</p>}
                    </div>
                    <select
                      value={l.state || "novo"}
                      onChange={(e) => updateLead(l._id, { state: e.target.value })}
                      data-testid={`crm-state-${l._id}`}
                      className={`rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] ${STATE_COLORS[l.state || "novo"]}`}
                    >
                      {Object.entries(STATE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>

                  <button onClick={() => setExpanded(expanded === l._id ? null : l._id)} data-testid={`crm-notes-toggle-${l._id}`} className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-brass-dark">
                    {(l.notes || []).length > 0 ? `Notas internas (${l.notes.length})` : "+ Adicionar nota"}
                  </button>
                  {expanded === l._id && (
                    <div className="mt-3 rounded-sm bg-bone2/60 p-4">
                      {(l.notes || []).map((n, i) => (
                        <p key={i} className="text-xs text-mute">
                          <strong>{fmtDate(n.at)} · {n.by}:</strong> {n.text}
                        </p>
                      ))}
                      <div className="mt-3 flex gap-2">
                        <input
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Nota interna…"
                          data-testid={`crm-note-input-${l._id}`}
                          className="w-full rounded-sm border border-line bg-white px-3 py-2 text-xs outline-none focus:border-brass"
                        />
                        <button
                          onClick={() => { if (noteDraft.trim()) { updateLead(l._id, { note: noteDraft.trim() }); setNoteDraft(""); } }}
                          data-testid={`crm-note-save-${l._id}`}
                          className="rounded-full bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-bone"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {leads.length === 0 && <p className="py-10 text-center text-sm text-faint">Sem pedidos de contacto por agora.</p>}
            </div>
          </section>
        )}

        {tab === "utilizadores" && (
          <section className="mt-8" data-testid="admin-users">
            <form onSubmit={createUser} className="flex flex-wrap items-end gap-3 rounded-sm border border-line bg-white p-5" data-testid="admin-user-form">
              <div className="flex-1">
                <label className="text-[9px] uppercase tracking-[0.24em] text-faint">Nome</label>
                <input required value={newUser.name} onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))} className={`${inputCls} mt-1 w-full`} />
              </div>
              <div className="flex-1">
                <label className="text-[9px] uppercase tracking-[0.24em] text-faint">E-mail</label>
                <input required type="email" value={newUser.email} onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))} className={`${inputCls} mt-1 w-full`} />
              </div>
              <div className="flex-1">
                <label className="text-[9px] uppercase tracking-[0.24em] text-faint">Palavra-passe (mín. 8)</label>
                <input required minLength={8} type="password" value={newUser.password} onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))} className={`${inputCls} mt-1 w-full`} />
              </div>
              <button type="submit" data-testid="admin-user-create" className="rounded-full bg-ink px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-bone">Criar conta</button>
            </form>
            {userMsg && <p className={`mt-3 text-xs ${userMsg.ok ? "text-green-700" : "text-red-600"}`}>{userMsg.text}</p>}
            <div className="mt-5 space-y-2">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded-sm border border-line bg-white p-4" data-testid={`admin-user-${u._id}`}>
                  <div>
                    <p className="text-sm font-medium text-ivory">{u.name}</p>
                    <p className="text-xs text-faint">{u.email}</p>
                  </div>
                  {u.active ? (
                    <button onClick={() => revokeUser(u._id)} data-testid={`admin-user-revoke-${u._id}`} className="rounded-full border border-line px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-red-600 hover:border-red-300">
                      Revogar
                    </button>
                  ) : (
                    <span className="rounded-full bg-bone2 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-faint">Revogada</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
