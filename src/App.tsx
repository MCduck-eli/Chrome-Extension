import React, { useState, useEffect } from "react";
import { Clock, Globe, Trash2, Calendar } from "lucide-react";

declare const chrome: any;

const ALL_AVAILABLE_CITIES = [
    { name: "London", zone: "Europe/London" },
    { name: "New York", zone: "America/New_York" },
    { name: "Tokyo", zone: "Asia/Tokyo" },
    { name: "Dubai", zone: "Asia/Dubai" },
    { name: "Paris", zone: "Europe/Paris" },
];

const App: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const [cities, setCities] = useState([
        { id: "1", name: "Tashkent", zone: "Asia/Tashkent" },
    ]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        if (chrome?.storage) {
            chrome.storage.sync.get(
                ["myCities"],
                (res: any) => res.myCities && setCities(res.myCities),
            );
        }
        return () => clearInterval(timer);
    }, []);

    const formatTime = (zone: string, type: "time" | "date" = "time") => {
        try {
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
        } catch {
            return "00:00:00";
        }
    };

    const addCity = (city: any) => {
        if (cities.find((c) => c.zone === city.zone)) return;
        const newCities = [...cities, { id: Date.now().toString(), ...city }];
        setCities(newCities);
        chrome?.storage?.sync.set({ myCities: newCities });
    };

    const removeCity = (id: string) => {
        const newCities = cities.filter((c) => c.id !== id);
        setCities(newCities);
        chrome?.storage?.sync.set({ myCities: newCities });
    };

    return (
        <div
            style={{
                backgroundColor: "#050505",
                minHeight: "100vh",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "sans-serif",
                padding: "20px",
            }}
        >
            <div className="relative z-10 w-full max-w-5xl text-center">
                <div style={{ marginBottom: "60px" }}>
                    <div
                        style={{
                            color: "#3b82f6",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontSize: "12px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "10px",
                        }}
                    >
                        <Clock size={16} /> Tashkent Time
                    </div>
                    <h1
                        style={{
                            fontSize: "clamp(80px, 15vw, 160px)",
                            fontWeight: "100",
                            margin: "0",
                            letterSpacing: "-0.05em",
                            color: "white",
                        }}
                    >
                        {formatTime("Asia/Tashkent")}
                    </h1>
                    <div
                        style={{
                            color: "#64748b",
                            fontSize: "18px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "10px",
                        }}
                    >
                        <Calendar size={18} />{" "}
                        {formatTime("Asia/Tashkent", "date")}
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "20px",
                        width: "100%",
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
                                    borderRadius: "24px",
                                    position: "relative",
                                }}
                            >
                                <button
                                    onClick={() => removeCity(c.id)}
                                    style={{
                                        position: "absolute",
                                        top: "15px",
                                        right: "15px",
                                        background: "none",
                                        border: "none",
                                        color: "#475569",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div
                                    style={{
                                        color: "#475569",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        marginBottom: "5px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}
                                >
                                    <Globe size={12} /> {c.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: "36px",
                                        fontWeight: "200",
                                    }}
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
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        padding: "10px",
                        borderRadius: "20px",
                        display: "flex",
                        gap: "10px",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    {ALL_AVAILABLE_CITIES.map((ac) => (
                        <button
                            key={ac.name}
                            onClick={() => addCity(ac)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#94a3b8",
                                fontSize: "11px",
                                cursor: "pointer",
                                padding: "8px 12px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            + {ac.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
