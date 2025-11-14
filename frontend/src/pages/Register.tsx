import React from 'react'
import { useForm } from 'react-hook-form'
import { useRegister } from '../hooks/useAuthApi'
import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const { register, handleSubmit } = useForm()
  const reg = useRegister()
  const auth = useAuth()
  const nav = useNavigate()
  const onSubmit = (data:any)=>{ reg.mutate(data, { onSuccess: (res)=>{ auth.setAuth(res.user, res.token); nav('/todos') }, onError: (e:any)=> alert(e.response?.data?.message || e.message) }) }
  return (
    <div className="card max-w-md mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4">Register</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('name')} placeholder="Name" className="input" />
        <input {...register('email')} placeholder="Email" className="input" />
        <input {...register('password')} placeholder="Password" type="password" className="input" />
        <input {...register('country')} placeholder="Country" className="input" />
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  )
}
