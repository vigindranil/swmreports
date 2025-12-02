module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/api/property-waste-report/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month");
        const year = searchParams.get("year");
        const stateID = searchParams.get("stateID");
        const districtID = searchParams.get("districtID");
        const blockID = searchParams.get("blockID");
        const gpID = searchParams.get("gpID");
        const level = searchParams.get("level");
        // Build the backend URL with query parameters
        const backendUrl = new URL("https://swmapi.vercel.app/api/property-waste-report");
        backendUrl.searchParams.set("month", month || "August");
        backendUrl.searchParams.set("year", year || "2025");
        backendUrl.searchParams.set("stateID", stateID || "1");
        backendUrl.searchParams.set("districtID", districtID || "0");
        backendUrl.searchParams.set("blockID", blockID || "0");
        backendUrl.searchParams.set("gpID", gpID || "0");
        backendUrl.searchParams.set("level", level || "1");
        const response = await fetch(backendUrl.toString());
        if (!response.ok) {
            throw new Error(`Backend responded with ${response.status}`);
        }
        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error("[v0] Property waste report API route error:", error);
        return Response.json({
            success: false,
            error: "Failed to fetch property waste report data from backend",
            data: []
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__41082292._.js.map