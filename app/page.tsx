"use client";

import { FormEvent, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();

    if (data.success) {
      setUsers(data.users);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (!ignore && data.success) {
        setUsers(data.users);
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setName("");
        setEmail("");

        await fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "700px", margin: "50px auto" }}>
      <h1>User Management</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id} style={{ marginTop: "20px" }}>
          <strong>{user.name}</strong>
          <br />
          <span>{user.email}</span>
        </div>
      ))}
    </main>
  );
}