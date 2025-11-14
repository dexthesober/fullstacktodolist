import React from 'react'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hooks/useAuthApi'
import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const { register, handleSubmit } = useForm()
  const mut = useLogin()
  const auth = useAuth()
  const nav = useNavigate()
  const onSubmit = (data:any)=>{ mut.mutate(data, { onSuccess: (res)=>{ auth.setAuth(res.user, res.token); nav('/todos') }, onError: (e:any)=> alert(e.response?.data?.message || e.message) }) }
  return (
    <div className="card max-w-md mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4">Login</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email')} placeholder="Email" className="input" />
        <input {...register('password')} placeholder="Password" type="password" className="input" />
        <div className="flex gap-2 items-center">
          <button className="btn btn-primary">Login</button>
          <a className="text-sm text-white" href="/forgot">Forgot?</a>
        </div>
      </form>
    </div>
  )
}
