// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';
// import Link from 'next/link';

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();
      
//       if (response.ok) {
//         // Store ONLY user email in localStorage (no sensitive tokens)
//         localStorage.setItem('userEmail', email);
        
//         // The token is automatically stored as HttpOnly cookie by the API
//         // No need to manually set it with document.cookie
        
//         toast.success('Login Successful');
//         router.push('/dashboard');
//       } else {
//         toast.error(data.message || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       toast.error('An error occurred during login');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <Input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <Button type="submit" className="w-full">
//             Login
//           </Button>
//         </form>
//         <div className="text-center">
//           <p>
//             Don't have an account?{' '}
//             <Link href="/register" className="text-primary hover:underline">
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Store ONLY user email in localStorage (for UI purposes)
        localStorage.setItem("userEmail", email);

        // The token is automatically stored as HttpOnly cookie by the API
        
        toast.success("Login Successful");

        router.push("/"); // ✅ Redirects the user to the home page
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-md border border-border">
        <h2 className="text-2xl font-bold text-center text-foreground">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="text-center text-muted-foreground">
          <p>
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
