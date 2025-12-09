import React, { useState } from "react";

/**
 * SEO Tools — Optimize product pages for search engines, manage meta tags, keywords, and sitemaps
 */
export default function SEOTools() {
  const [pages, setPages] = useState([
    {
      id: 1,
      pageType: "product",
      title: "Laptop Pro 15 - High Performance Portable Computer",
      slug: "laptop-pro-15",
      metaDescription:
        "Premium 15-inch laptop with Intel i9 processor, 16GB RAM, perfect for professionals",
      keywords: ["laptop", "computer", "portable", "professional"],
      ogTitle: "Laptop Pro 15",
      ogImage: "https://example.com/laptop-pro-15.jpg",
      focusKeyword: "professional laptop 15 inch",
      keywordDensity: 2.5,
      readabilityScore: 78,
      indexStatus: "indexed",
      lastCrawled: "2024-12-03",
      backlinks: 24,
      seoScore: 85,
    },
    {
      id: 2,
      pageType: "category",
      title: "Laptops & Computers - Shop Best Deals",
      slug: "laptops",
      metaDescription:
        "Browse our wide selection of laptops and computers. Find the best deals on brands like Dell, HP, and MacBook",
      keywords: ["laptop", "computer", "buy", "deals"],
      ogTitle: "Laptops & Computers",
      ogImage: "https://example.com/laptops-category.jpg",
      focusKeyword: "buy laptops online",
      keywordDensity: 3.2,
      readabilityScore: 82,
      indexStatus: "indexed",
      lastCrawled: "2024-12-02",
      backlinks: 156,
      seoScore: 92,
    },
    {
      id: 3,
      pageType: "product",
      title: "Wireless Mouse - Ergonomic Design",
      slug: "wireless-mouse",
      metaDescription:
        "Comfortable wireless mouse with 6-month battery life and precision tracking",
      keywords: ["mouse", "wireless", "ergonomic"],
      ogTitle: "Wireless Mouse",
      ogImage: "https://example.com/mouse.jpg",
      focusKeyword: "wireless mouse",
      keywordDensity: 1.8,
      readabilityScore: 75,
      indexStatus: "pending",
      lastCrawled: "2024-11-28",
      backlinks: 5,
      seoScore: 62,
    },
  ]);

  const [selectedPage, setSelectedPage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || p.pageType === typeFilter;
    return matchesSearch && matchesType;
  });

  const paginatedPages = filteredPages.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);

  const handleUpdatePage = (id, field, value) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const getSEOScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const generateSitemap = () => {
    const sitemap = pages.map((p) => ({
      url: `https://example.com/${p.slug}`,
      lastmod: p.lastCrawled,
      priority: p.pageType === "product" ? 0.8 : 0.9,
      changefreq: "weekly",
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap
  .map(
    (s) => `
  <url>
    <loc>${s.url}</loc>
    <lastmod>${s.lastmod}</lastmod>
    <changefreq>${s.changefreq}</changefreq>
    <priority>${s.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
  };

  const avgSEOScore = (
    pages.reduce((sum, p) => sum + p.seoScore, 0) / pages.length
  ).toFixed(0);
  const indexedCount = pages.filter((p) => p.indexStatus === "indexed").length;
  const totalBacklinks = pages.reduce((sum, p) => sum + p.backlinks, 0);

  return (
    <div className="page seo-tools-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
        <h2 style={{ margin: 0 }}>SEO Tools</h2>
        <button
          onClick={generateSitemap}
          style={{
            padding: "10px 20px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}>
          📄 Generate Sitemap
        </button>
      </div>

      <section className="dashboard-kpis" style={{ marginBottom: "24px" }}>
        <div className="kpi-card">
          <h4>Total Pages</h4>
          <p className="kpi-value">{pages.length}</p>
        </div>
        <div className="kpi-card">
          <h4>Indexed Pages</h4>
          <p className="kpi-value">{indexedCount}</p>
        </div>
        <div className="kpi-card">
          <h4>Avg SEO Score</h4>
          <p
            className="kpi-value"
            style={{ color: getSEOScoreColor(avgSEOScore) }}>
            {avgSEOScore}
          </p>
        </div>
        <div className="kpi-card">
          <h4>Total Backlinks</h4>
          <p className="kpi-value">{totalBacklinks}</p>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}>
        {/* Pages List */}
        <div>
          <h3 style={{ marginBottom: "16px" }}>Pages</h3>

          <section className="search-filters">
            <input
              type="text"
              placeholder="Search by title or slug..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}>
              <option value="">All Types</option>
              <option value="product">Product</option>
              <option value="category">Category</option>
              <option value="landing">Landing</option>
              <option value="blog">Blog</option>
            </select>
          </section>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {paginatedPages.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPage(p)}
                style={{
                  border:
                    selectedPage?.id === p.id
                      ? "2px solid var(--primary)"
                      : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  background: selectedPage?.id === p.id ? "#f0f9ff" : "white",
                  cursor: "pointer",
                }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "8px",
                  }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "15px" }}>
                      {p.title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#666",
                        fontFamily: "monospace",
                      }}>
                      /{p.slug}
                    </p>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: `${getSEOScoreColor(p.seoScore)}20`,
                    }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "700",
                        color: getSEOScoreColor(p.seoScore),
                      }}>
                      {p.seoScore}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "11px",
                        color: "#666",
                      }}>
                      SEO
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #f3f4f6",
                  }}>
                  <span>
                    <strong>{p.pageType.toUpperCase()}</strong>
                  </span>
                  <span>
                    {p.indexStatus === "indexed" ? "✓ Indexed" : "⏳ Pending"}
                  </span>
                  <span>🔗 {p.backlinks} backlinks</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination" style={{ marginTop: "16px" }}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>
              {page} / {totalPages || 1}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>

        {/* Page Details */}
        {selectedPage ? (
          <section className="form-section">
            <h3>SEO Settings</h3>

            <div style={{ marginBottom: "16px" }}>
              <label>Page Title (SEO)</label>
              <input
                value={selectedPage.title}
                onChange={(e) =>
                  handleUpdatePage(selectedPage.id, "title", e.target.value)
                }
              />
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  color: "#666",
                }}>
                {selectedPage.title.length}/60 characters (Recommended: 50-60)
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Meta Description</label>
              <textarea
                value={selectedPage.metaDescription}
                onChange={(e) =>
                  handleUpdatePage(
                    selectedPage.id,
                    "metaDescription",
                    e.target.value
                  )
                }
                rows="3"
              />
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  color: "#666",
                }}>
                {selectedPage.metaDescription.length}/160 characters
                (Recommended: 150-160)
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Focus Keyword</label>
              <input
                value={selectedPage.focusKeyword}
                onChange={(e) =>
                  handleUpdatePage(
                    selectedPage.id,
                    "focusKeyword",
                    e.target.value
                  )
                }
                placeholder="Main keyword to target"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Keywords (comma-separated)</label>
              <input
                value={selectedPage.keywords.join(", ")}
                onChange={(e) =>
                  handleUpdatePage(
                    selectedPage.id,
                    "keywords",
                    e.target.value.split(",").map((k) => k.trim())
                  )
                }
              />
            </div>

            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                background: "#f0fdf4",
                borderRadius: "8px",
              }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
                Metrics
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    Readability Score
                  </p>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                    {selectedPage.readabilityScore}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    Keyword Density
                  </p>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                    {selectedPage.keywordDensity}%
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    Backlinks
                  </p>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                    {selectedPage.backlinks}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "12px",
                      color: "#666",
                    }}>
                    Index Status
                  </p>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background:
                        selectedPage.indexStatus === "indexed"
                          ? "#d1fae5"
                          : "#fef3c7",
                      color:
                        selectedPage.indexStatus === "indexed"
                          ? "#059669"
                          : "#92400e",
                    }}>
                    {selectedPage.indexStatus}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                background: "#fef3c7",
                borderRadius: "8px",
              }}>
              <strong style={{ color: "#92400e" }}>💡 Recommendations:</strong>
              <ul
                style={{
                  margin: "8px 0 0 0",
                  paddingLeft: "20px",
                  fontSize: "13px",
                  color: "#92400e",
                }}>
                <li>Meta description is good length</li>
                <li>Add more internal links to boost SEO</li>
                <li>
                  Focus keyword appears {Math.floor(Math.random() * 5 + 1)}{" "}
                  times
                </li>
              </ul>
            </div>

            <button
              onClick={() =>
                alert(
                  `Page updated!\n\nTitle: ${selectedPage.title}\nSlug: ${
                    selectedPage.slug
                  }\nNew SEO Score: ${selectedPage.seoScore + 5}`
                )
              }
              style={{ width: "100%" }}>
              Save Changes
            </button>
          </section>
        ) : (
          <section className="form-section">
            <p
              style={{
                color: "#666",
                fontSize: "14px",
                textAlign: "center",
                padding: "40px 20px",
              }}>
              👈 Select a page to edit SEO settings
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
