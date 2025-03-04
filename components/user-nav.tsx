// "use client";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// export function UserNav() {
//   const router = useRouter();
//   const [user, setUser] = useState<{ email: string; name: string } | null>(null);

//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem('token');
//     const userEmail = localStorage.getItem('userEmail');
    
//     if (token && userEmail) {
//       setUser({ 
//         email: userEmail, 
//         name: userEmail.split('@')[0] 
//       });
//     }
//   }, []);

//   const handleLogout = () => {
//     // Clear user session
//     localStorage.removeItem('token');
//     localStorage.removeItem('userEmail');
    
//     // Redirect to login page
//     router.push("/login");
//   };

//   if (!user) {
//     return (
//       <Button onClick={() => router.push("/login")}>
//         Login
//       </Button>
//     );
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//           <Avatar className="h-8 w-8">
//             <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="w-56" align="end" forceMount>
//         <DropdownMenuLabel className="font-normal">
//           <div className="flex flex-col space-y-1">
//             <p className="text-sm font-medium leading-none">{user.name}</p>
//             <p className="text-xs leading-none text-muted-foreground">
//               {user.email}
//             </p>
//           </div>
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuGroup>
//           <DropdownMenuItem onClick={() => router.push("/dashboard")}>
//             Dashboard
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => router.push("/new")}>
//             New Post
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => router.push("/settings")}>
//             Settings
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem onClick={handleLogout}>
//           Log out
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get email from localStorage - non-sensitive data
        const userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail) {
          setLoading(false);
          return;
        }

        // Fetch user data from API using the HttpOnly cookie token for auth
        const response = await fetch('/api/user');
        
        if (response.ok) {
          const data = await response.json();
          setUser({ 
            email: data.user.email,
            name: data.user.name || data.user.email.split('@')[0]
          });
        } else {
          // Handle failed auth - clear localStorage
          localStorage.removeItem('userEmail');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API to clear the HttpOnly cookie
      await fetch('/api/logout', { method: 'POST' });
      // Clear localStorage
      localStorage.removeItem('userEmail');
      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <Button variant="ghost" size="sm">Loading...</Button>;
  }

  if (!user) {
    return (
      <Button variant="default" size="sm" onClick={() => router.push('/login')}>
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/default.png" alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}