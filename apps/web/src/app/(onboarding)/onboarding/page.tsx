"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/hooks/use-me-query";
import { useDebounce } from "@/hooks/use-debounce";
import { useOnboardingStore } from "@/store/onboarding-store";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { ArrowRight, CheckCircle2, Loader2, XCircle, Sparkles, User, AtSign } from "lucide-react";
import { API_BASE } from "@/utils/constants";

export default function OnboardingPage() {
    const router = useRouter();
    const { step, username, setUsername, nextStep } = useOnboardingStore();
    const { data: me, isLoading: meLoading } = useMeQuery(true);

    const [usernameInput, setUsernameInput] = useState("");
    const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
    const [claiming, setClaiming] = useState(false);
    const [claimError, setClaimError] = useState<string | null>(null);

    const debouncedUsername = useDebounce(usernameInput, 300);

    // Debounced username availability check
    useEffect(() => {
        if (!debouncedUsername || debouncedUsername.length < 2 || debouncedUsername.length > 14) {
            setAvailability("idle");
            return;
        }

        const checkAvailability = async () => {
            setAvailability("checking");
            try {
                const res = await fetch(`${API_BASE}/api/v1/user/check-username-availaible`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ username: debouncedUsername }),
                });

                if (res.status === 409) {
                    setAvailability("taken");
                } else if (res.ok) {
                    setAvailability("available");
                } else {
                    setAvailability("error");
                }
            } catch {
                setAvailability("error");
            }
        };

        checkAvailability();
    }, [debouncedUsername]);

    const handleClaim = async () => {
        if (availability !== "available" || usernameInput.length < 2) return;

        setClaiming(true);
        setClaimError(null);

        try {
            const res = await fetch(`${API_BASE}/api/v1/user/claim-username`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: usernameInput }),
            });

            const data = await res.json();

            if (data.success) {
                setUsername(usernameInput);
                nextStep();
            } else {
                setClaimError(data.message || "Failed to claim username");
            }
        } catch {
            setClaimError("Something went wrong. Please try again.");
        } finally {
            setClaiming(false);
        }
    };

    if (meLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
            {/* Progress indicator */}
            <div className="mb-8 flex items-center gap-3">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                                step >= s
                                    ? "bg-white text-black shadow-lg shadow-white/20"
                                    : "border border-zinc-700 text-zinc-500"
                            }`}
                        >
                            {step > s ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                s
                            )}
                        </div>
                        {s < 3 && (
                            <div
                                className={`h-0.5 w-12 transition-all duration-300 ${
                                    step > s ? "bg-white" : "bg-zinc-800"
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 1: Welcome */}
            {step === 1 && (
                <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                            <Sparkles className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Welcome to Console Me
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-base mt-2">
                            Let&apos;s set up your creator account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {me?.user && (
                            <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                                {me.user.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={me.user.image}
                                        alt={me.user.name}
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-zinc-700"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-zinc-700">
                                        <User className="h-6 w-6 text-zinc-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-white">{me.user.name}</p>
                                    <p className="text-sm text-zinc-400">{me.user.email}</p>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-zinc-400 leading-relaxed">
                            You&apos;re one step away from unlocking your creator dashboard.
                            First, let&apos;s pick a unique username for your profile.
                        </p>

                        <Button
                            onClick={nextStep}
                            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-6 text-base rounded-xl"
                        >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Claim Username */}
            {step === 2 && (
                <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/25">
                            <AtSign className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Claim Your Username
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-base mt-2">
                            This will be your unique creator handle
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">
                                    @
                                </span>
                                <Input
                                    type="text"
                                    placeholder="username"
                                    value={usernameInput}
                                    onChange={(e) => {
                                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                                        setUsernameInput(val);
                                    }}
                                    maxLength={14}
                                    className="pl-8 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 h-12 rounded-xl focus:border-white focus:ring-white/20"
                                />
                            </div>

                            {/* Validation hint */}
                            <p className="text-xs text-zinc-500">
                                2-14 characters. Letters, numbers, and underscores only.
                            </p>

                            {/* Availability feedback */}
                            {usernameInput.length >= 2 && (
                                <div className="flex items-center gap-2 text-sm">
                                    {availability === "checking" && (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                                            <span className="text-zinc-400">Checking availability...</span>
                                        </>
                                    )}
                                    {availability === "available" && (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            <span className="text-emerald-400">@{debouncedUsername} is available!</span>
                                        </>
                                    )}
                                    {availability === "taken" && (
                                        <>
                                            <XCircle className="h-4 w-4 text-red-400" />
                                            <span className="text-red-400">@{debouncedUsername} is already taken</span>
                                        </>
                                    )}
                                    {availability === "error" && (
                                        <>
                                            <XCircle className="h-4 w-4 text-amber-400" />
                                            <span className="text-amber-400">Could not check. Try again.</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {claimError && (
                                <p className="text-sm text-red-400">{claimError}</p>
                            )}
                        </div>

                        <Button
                            onClick={handleClaim}
                            disabled={availability !== "available" || claiming || usernameInput.length < 2}
                            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-6 text-base rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {claiming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Claiming...
                                </>
                            ) : (
                                "Claim Username"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <Card className="w-full max-w-md border-zinc-800 bg-zinc-950 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/25">
                            <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            You&apos;re All Set!
                        </CardTitle>
                        <CardDescription className="text-zinc-400 text-base mt-2">
                            Your creator account has been created
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
                            <p className="text-sm text-zinc-400 mb-1">Your username</p>
                            <p className="text-2xl font-bold text-white">
                                @{username}
                            </p>
                        </div>

                        <p className="text-sm text-zinc-400 text-center leading-relaxed">
                            Welcome to Console Me! Your creator profile is ready.
                            Start sharing content with your audience.
                        </p>

                        <Button
                            onClick={() => router.push("/home")}
                            className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-6 text-base rounded-xl"
                        >
                            Go to Homepage
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
