import { useMemo, useState } from "react";
import TopBar from "../components/TopBar/TopBar";
import "./InventoryPage.css";

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  categories: string[];
  expiresAt: string;
  price: number;
  stock: number;
  status: "Disponible" | "Agotado" | "Caducado" | "Mínimo";
  updatedAt: string;
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Desinfección - Spray anti-bacterial",
    sku: "SKU 1023-8654",
    categories: ["Desinfección", "Aseo"],
    expiresAt: "10 nov. 2024",
    price: 15.0,
    stock: 12,
    status: "Disponible",
    updatedAt: "Actualizado: ahora",
  },
  {
    id: 2,
    name: "Vacunas COVID - Genética",
    sku: "SKU 2748-1201",
    categories: ["Farmacéutico"],
    expiresAt: "15 dic. 2024",
    price: 125.0,
    stock: 32,
    status: "Disponible",
    updatedAt: "Actualizado: ahora",
  },
  {
    id: 3,
    name: "Electrolitos y minerales",
    sku: "SKU 2469-5633",
    categories: ["Farmacéutico"],
    expiresAt: "24 oct. 2024",
    price: 85.5,
    stock: 45,
    status: "Mínimo",
    updatedAt: "Actualizado: ahora",
  },
  {
    id: 4,
    name: "Vitaminas y minerales",
    sku: "SKU 2469-5633",
    categories: ["Farmacéutico"],
    expiresAt: "24 oct. 2024",
    price: 40.5,
    stock: 8,
    status: "Caducado",
    updatedAt: "Actualizado: ahora",
  },
  {
    id: 5,
    name: "Oximetazón comprimidos",
    sku: "SKU 1980-1100",
    categories: ["Farmacéutico"],
    expiresAt: "21 oct. 2024",
    price: 65.0,
    stock: 29,
    status: "Mínimo",
    updatedAt: "Actualizado: hace 3h",
  },
  {
    id: 6,
    name: "Remedio para alergias",
    sku: "SKU 3201-7788",
    categories: ["Farmacéutico", "Temporada"],
    expiresAt: "01 ene. 2025",
    price: 72.25,
    stock: 64,
    status: "Disponible",
    updatedAt: "Actualizado: hace 5h",
  },
];

const statusToColor: Record<InventoryItem["status"], string> = {
  Disponible: "status--green",
  Agotado: "status--red",
  Caducado: "status--red",
  Mínimo: "status--orange",
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [expiresAt, setExpiresAt] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const categories = useMemo(() => {
    const set = new Set<string>();
    inventoryData.forEach((item) => item.categories.forEach((c) => set.add(c)));
    return ["Todas", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas" || item.categories.includes(category);

      const matchesStatus = status === "Todos" || item.status === status;

      const matchesExpiration =
        !expiresAt || item.expiresAt.toLowerCase().includes(expiresAt.toLowerCase());

      return matchesSearch && matchesCategory && matchesStatus && matchesExpiration;
    });
  }, [search, category, status, expiresAt]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleChangePage = (value: number) => {
    const nextPage = Math.min(Math.max(1, value), totalPages);
    setPage(nextPage);
  };

  return (
    <div className="page inventory-page">
      <TopBar currentPath={window.location.pathname} />
      <main className="page__content">
        <header className="page__header">
          <div>
            <p className="eyebrow">Inventario</p>
            <h1>Inventario General</h1>
            <p className="lead">Administra productos, existencias y fechas de caducidad.</p>
          </div>
          <div className="header__actions">
            <button className="ghost">Añadir Nuevo Producto</button>
            <button>Registrar nueva compra</button>
          </div>
        </header>

        <section className="filters">
          <div className="input-group">
            <label>Búsqueda rápida</label>
            <input
              placeholder="Nombre o SKU"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <label>Fecha de caducidad</label>
            <input
              placeholder="Ej. oct. 2024"
              value={expiresAt}
              onChange={(e) => {
                setPage(1);
                setExpiresAt(e.target.value);
              }}
            />
          </div>
          <div className="input-group">
            <label>Categoría</label>
            <select
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value);
              }}
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Estado</label>
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option>Todos</option>
              <option>Disponible</option>
              <option>Mínimo</option>
              <option>Agotado</option>
              <option>Caducado</option>
            </select>
          </div>
        </section>

        <section className="table-card">
          <div className="table__head">
            <div className="table__title">Existencias actuales</div>
            <div className="table__meta">{filtered.length} productos</div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categorías</th>
                <th>Fecha caducidad</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="product">
                      <div className="product__avatar">{item.name.charAt(0)}</div>
                      <div>
                        <div className="product__name">{item.name}</div>
                        <div className="muted">{item.updatedAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="sku">{item.sku}</td>
                  <td>
                    <div className="chips">
                      {item.categories.map((cat) => (
                        <span className="chip" key={cat}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{item.expiresAt}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock} unidades</td>
                  <td>
                    <span className={`status ${statusToColor[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="ghost">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="pagination__controls">
              <button
                className="ghost"
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="ghost"
                onClick={() => handleChangePage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
