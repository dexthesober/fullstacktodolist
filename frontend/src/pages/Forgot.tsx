import React from 'react'
import { useForm } from 'react-hook-form'
import { useForgot } from '../hooks/useAuthApi'

export default function Forgot(){
  const { register, handleSubmit } = useForm()
  const mut = useForgot()
  const onSubmit = (data:any)=> mut.mutate(data, { onSuccess: (res)=> alert(res.message || 'Check email') })
  return (
    <div className="card max-w-md mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4">Forgot Password</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('email')} placeholder="Email" className="input" />
        <button className="btn btn-primary">Send reset</button>
      </form>
    </div>
  )
}
