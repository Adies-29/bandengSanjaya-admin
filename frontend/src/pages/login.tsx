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
            const responseData = data.data || data.daya;
            if (responseData) {
                const { token, admin } = responseData;
                login(token, admin);
                navigate('/categories');
            }
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    BS
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-wide">
                        Bandeng Sanjaya
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Panel Admin Kelola Website Toko
                    </p>
                </div>      
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
    );

};

export default Login;