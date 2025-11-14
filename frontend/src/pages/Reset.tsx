import React from "react";
import { useForm } from "react-hook-form";
import { useReset } from "../hooks/useAuthApi";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Reset() {
    const { register, handleSubmit } = useForm();
    const mut = useReset();
    const [qs] = useSearchParams();
    const nav = useNavigate();
    const onSubmit = (data: any) => {
        const payload = {
            email: qs.get("email"),
            token: qs.get("token"),
            password: data.password,
        };
        mut.mutate(payload, {
            onSuccess: () => {
                alert("Password updated");
                nav("/login");
            },
            onError: (e: any) => alert(e.response?.data?.message || e.message),
        });
    };
    return (
        <div className="card max-w-md mx-auto mt-8">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                    {...register("password")}
                    placeholder="New password"
                    type="password"
                    className="input"
                />
                <button className="btn btn-primary">Reset</button>
            </form>
        </div>
    );
}
