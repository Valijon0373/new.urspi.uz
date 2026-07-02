import { useState } from "react"
import { Eye, EyeOff, Loader2, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import logoImg from "../../assets/images/urspi_new.png"

export default function AdminLogin({ onSuccess }) {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: "", password: "" })
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        const username = form.username.trim()
        const password = form.password
        if (!username || !password) {
            setError("Login va parolni kiriting")
            return
        }

        setBusy(true)
        setError("")
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            if (username === "admin" && password === "admin123") {
                onSuccess?.()
                navigate("/dashboard")
            } else {
                throw new Error("Noto'g'ri login yoki parol")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kirish amalga oshmadi")
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-login-title"
                className="relative w-full max-w-[400px] rounded-2xl border border-slate-200 bg-white px-8 pb-8 pt-9 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            >
                <Link
                    to="/"
                    className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label="Yopish"
                >
                    <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </Link>

                <div className="flex flex-col items-center text-center">
                    <img
                        src={logoImg}
                        alt="UrSPI logo"
                        className="h-[84px] w-[84px] rounded-full object-cover"
                    />
                    <div
                        id="admin-login-title"
                        role="heading"
                        aria-level={1}
                        className="mt-5 whitespace-nowrap text-2xl font-bold text-black"
                    >
                        Admin Panelga Kirish
                    </div>
                </div>

                <form className="mt-7 space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-1.5 text-left">
                        <label htmlFor="admin-login-field" className="block text-sm font-bold text-slate-900">
                            Login
                        </label>
                        <input
                            id="admin-login-field"
                            autoComplete="username"
                            value={form.username}
                            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                            placeholder="Loginni kiriting"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                        />
                    </div>

                    <div className="space-y-1.5 text-left">
                        <label htmlFor="admin-password-field" className="block text-sm font-bold text-slate-900">
                            Parol
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password-field"
                                autoComplete="current-password"
                                type={passwordVisible ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                placeholder="Parolni kiriting"
                                className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setPasswordVisible((v) => !v)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                aria-label={passwordVisible ? "Parolni yashirish" : "Parolni ko'rsatish"}
                            >
                                {passwordVisible ? (
                                    <EyeOff className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                                ) : (
                                    <Eye className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-rose-50 px-3 py-2 text-left text-sm text-rose-700 ring-1 ring-rose-100">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={busy}
                        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                        {busy ? "Kutilmoqda..." : "Kirish"}
                    </button>
                </form>
            </div>
        </div>
    )
}
