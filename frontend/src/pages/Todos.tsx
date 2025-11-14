import React, { useState } from 'react'
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos'
import { useForm } from 'react-hook-form'
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";

export default function Todos() {
  const { data: todos, isLoading } = useTodos();
  const create = useCreateTodo();
  const update = useUpdateTodo();
  const del = useDeleteTodo();

  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue } = useForm();
  const [editId, setEditId] = useState<string | null>(null);

  const onCreate = (data: any) => {
    create.mutate(data, { onSuccess: () => reset() });
  };

  const onUpdate = (data: any) => {
    if (!editId) return;
    update.mutate(
      { id: editId, data },
      {
        onSuccess: () => {
          reset();
          setEditId(null);
        },
      }
    );
  };

  const startEdit = (todo: any) => {
    setEditId(todo._id);
    setValue("title", todo.title);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">

      {/* ✅ LOGOUT BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 bg-red-600 text-white rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="card mb-4 p-4 border rounded">
        <form
          className="flex gap-2"
          onSubmit={handleSubmit(editId ? onUpdate : onCreate)}
        >
          <input
            {...register('title')}
            placeholder="Todo title"
            className="border p-2 rounded w-full"
          />

          {editId ? (
            <button className="px-4 py-2 bg-yellow-500 text-white rounded">
              Update
            </button>
          ) : (
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Add
            </button>
          )}
        </form>
      </div>

      {/* LIST */}
      <div className="grid gap-3">
        {todos?.map((t: any) => (
          <div
            key={t._id}
            className="card flex items-center justify-between p-4 border rounded"
          >
            <div>
              <h4 className={`${t.completed ? 'line-through text-gray-500' : ''}`}>
                {t.title}
              </h4>
            </div>

            <div className="flex gap-2">

              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded"
                onClick={() => startEdit(t)}
              >
                Edit
              </button>

              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() =>
                  update.mutate({ id: t._id, data: { completed: !t.completed } })
                }
              >
                {t.completed ? 'Undo' : 'Complete'}
              </button>

              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => del.mutate(t._id)}
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
