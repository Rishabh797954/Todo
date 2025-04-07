import React, { useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to home page
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "350px",
        padding: "2rem",
        backgroundColor: "rgba(18, 18, 18, 0.95)",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
        border: "1px solid #333",
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#ffffff",
          marginBottom: "1.5rem",
          fontSize: "1.8rem",
          fontWeight: "600"
        }}>Welcome</h2>
        
        <div style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="email" style={{
            display: "block",
            marginBottom: "8px",
            color: "#9ca3af",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#1f1f1f",
              color: "#ffffff",
              transition: "border-color 0.2s",
              outline: "none",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password" style={{
            display: "block",
            marginBottom: "8px",
            color: "#9ca3af",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#1f1f1f",
              color: "#ffffff",
              transition: "border-color 0.2s",
              outline: "none",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        {error && (
          <div style={{
            color: '#ff4444',
            textAlign: 'center',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "1px solid #333",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={{
          marginTop: "1rem",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "0.9rem"
        }}>
          Need an account?{' '}
          <Link href="/register" style={{
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "500"
          }}>
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;