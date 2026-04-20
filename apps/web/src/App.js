import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const markets = ["Makurdi", "Gboko", "Zaki Biam", "Otukpo"];
const commodities = [
    "Yam",
    "Cassava",
    "Rice",
    "Maize",
    "Beans",
    "Soybean",
    "Millet",
    "Sorghum",
];
export default function App() {
    return (_jsxs("main", { className: "app-shell", children: [_jsx("div", { className: "background-grid" }), _jsxs("section", { className: "hero-card", children: [_jsx("p", { className: "eyebrow", children: "BAPI - Benue AgriPrice Insight" }), _jsx("h1", { children: "Phase 4 local environment bootstrap is ready." }), _jsx("p", { className: "lead", children: "The frontend, backend, database orchestration, and ML service now have a shared local setup foundation for later implementation phases." }), _jsxs("div", { className: "info-grid", children: [_jsxs("article", { children: [_jsx("h2", { children: "Markets" }), _jsx("ul", { children: markets.map((market) => (_jsx("li", { children: market }, market))) })] }), _jsxs("article", { children: [_jsx("h2", { children: "Commodities" }), _jsx("ul", { children: commodities.map((commodity) => (_jsx("li", { children: commodity }, commodity))) })] })] })] })] }));
}
