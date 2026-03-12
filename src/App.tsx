import React, { useState, useEffect } from "react";
import { Trash2, Calendar, Bookmark, Search } from "lucide-react";

declare const chrome: any;

const ALL_TIMEZONES = [
    { name: "London", zone: "Europe/London" },
    { name: "New York", zone: "America/New_York" },
    { name: "Tokyo", zone: "Asia/Tokyo" },
    { name: "Dubai", zone: "Asia/Dubai" },
    { name: "Paris", zone: "Europe/Paris" },
    { name: "Seoul", zone: "Asia/Seoul" },
    { name: "Sydney", zone: "Australia/Sydney" },
    { name: "Tashkent", zone: "Asia/Tashkent" },
];

const App: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [cities, setCities] = useState([
        { id: "1", name: "Tashkent", zone: "Asia/Tashkent" },
    ]);
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        if (typeof chrome !== "undefined" && chrome.storage) {
            chrome.storage.sync.get(["myCities"], (res: any) => {
                if (res.myCities) setCities(res.myCities);
            });

            chrome.bookmarks.getTree((tree: any) => {
                const items = tree[0]?.children?.[0]?.children || [];
                setBookmarks(items.slice(0, 12));
            });
        }
        return () => clearInterval(timer);
    }, []);

    const formatTime = (zone: string, type: "time" | "date" = "time") => {
        return new Intl.DateTimeFormat(
            "en-GB",
            type === "time"
                ? {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                      timeZone: zone,
                  }
                : {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      timeZone: zone,
                  },
        ).format(time);
    };

    const addCity = (city: any) => {
        if (cities.find((c) => c.zone === city.zone)) return;
        const newCities = [...cities, { id: Date.now().toString(), ...city }];
        setCities(newCities);
        chrome?.storage?.sync.set({ myCities: newCities });
        setSearchTerm("");
    };

    const removeCity = (id: string) => {
        const newCities = cities.filter((c) => c.id !== id);
        setCities(newCities);
        chrome?.storage?.sync.set({ myCities: newCities });
    };

    const filteredOptions = ALL_TIMEZONES.filter((tz) =>
        tz.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div
            style={{
                backgroundColor: "#050505",
                minHeight: "100vh",
                color: "white",
                fontFamily: "sans-serif",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "60px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {bookmarks.map((b) => (
                    <a
                        key={b.id}
                        href={b.url}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "10px",
                            fontSize: "12px",
                            color: "#94a3b8",
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <Bookmark size={14} /> {b.title.slice(0, 15)}
                    </a>
                ))}
            </div>
            <div style={{ textAlign: "center", marginBottom: "80px" }}>
                <h1
                    style={{
                        fontSize: "140px",
                        fontWeight: "100",
                        margin: 0,
                        letterSpacing: "-0.05em",
                    }}
                >
                    {formatTime("Asia/Tashkent")}
                </h1>
                <div
                    style={{
                        color: "#64748b",
                        fontSize: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <Calendar size={20} /> {formatTime("Asia/Tashkent", "date")}
                </div>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                    width: "100%",
                    maxWidth: "1200px",
                    marginBottom: "100px",
                }}
            >
                {cities
                    .filter((c) => c.name !== "Tashkent")
                    .map((c) => (
                        <div
                            key={c.id}
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                padding: "30px",
                                borderRadius: "30px",
                                position: "relative",
                            }}
                        >
                            <button
                                onClick={() => removeCity(c.id)}
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    background: "none",
                                    border: "none",
                                    color: "#475569",
                                    cursor: "pointer",
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                            <div
                                style={{
                                    color: "#3b82f6",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    marginBottom: "10px",
                                }}
                            >
                                {c.name}
                            </div>
                            <div
                                style={{ fontSize: "42px", fontWeight: "200" }}
                            >
                                {formatTime(c.zone)}
                            </div>
                        </div>
                    ))}
            </div>
            <div
                style={{
                    position: "fixed",
                    bottom: "40px",
                    width: "400px",
                    background: "rgba(20,20,20,0.8)",
                    backdropFilter: "blur(20px)",
                    padding: "15px",
                    borderRadius: "25px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "rgba(255,255,255,0.05)",
                        padding: "10px 15px",
                        borderRadius: "15px",
                    }}
                >
                    <Search size={18} color="#475569" />
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            outline: "none",
                            width: "100%",
                        }}
                    />
                </div>
                {searchTerm && (
                    <div
                        style={{
                            marginTop: "10px",
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        {filteredOptions.map((tz) => (
                            <div
                                key={tz.zone}
                                onClick={() => addCity(tz)}
                                onMouseEnter={() => setHoveredId(tz.zone)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    padding: "10px",
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    transition: "background 0.2s",
                                    backgroundColor:
                                        hoveredId === tz.zone
                                            ? "rgba(255,255,255,0.1)"
                                            : "transparent",
                                }}
                            >
                                {tz.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
