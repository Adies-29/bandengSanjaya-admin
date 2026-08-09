import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useForm } from 'react-hook-form';
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { Alert } from "../components/common/Alert";
import { InputText } from "../components/common/inputText";
import { LogIn, User } from "lucide-react";
import { InputPassword } from "../components/common/inputPassword";
import { Button } from "../components/common/Button";

interface LoginFormInputs {
    username: string;
    password: string;
}


const Login: React.FC = () => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormInputs) => {
            const res = await api.post('/auth/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            const { token, admin } = data.data;
            login(token, admin);
            navigate('/dashboard');
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || 'Gagal Login';
            setErrorMsg(message);
        },
    });

    const onSubmit = (data: LoginFormInputs) => {
        setErrorMsg(null);
        loginMutation.mutate(data);
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-xl flex items-center justify-center mx-auto mb-3">
                    B5
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">
                        Bandeng Sanjaya
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Panel Admin Kelola Website Toko
                    </p>

                    <Alert
                        message={errorMsg}
                        type="error"
                        onClose={() => setErrorMsg(null)}
                    />
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <InputText
                            label="Username"
                            placeholder="Masukan username admin"
                            icon={<User className="w-5 h-5" />}
                            error={errors.username?.message}
                            {...register('username', {
                                required: 'Usename wajib diisi'
                            })}
                        />
                        <InputPassword
                            label="Password"
                            placeholder="Masukan password"
                            error={errors.password?.message}
                            {...register('password', {
                                required: 'Password wajib diisi'
                            })}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={loginMutation.isPending}
                            icon={<LogIn className="w-5 h-5"/>}
                            className="w-full"
                        >
                            Masuk Ke Admin
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );

};

export default Login;