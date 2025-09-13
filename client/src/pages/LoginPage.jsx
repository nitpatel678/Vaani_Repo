import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { MapPin, ArrowLeft } from "lucide-react"
import { API_URL } from "../constants"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("") // optional, for UX only
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const url = `${API_URL}/api/auth/login`;
  console.log("Login URL:", url);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.warn("Server response is not valid JSON:", text);
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || "Login failed 😤");
    }

    // Save token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("Token stored in localStorage");
    } else {
      console.warn("No token received from backend");
    }

    // Redirect based on role
    const backendRole = data.user?.role;
    if (backendRole === "head") navigate("/dashboard/head");
    else if (backendRole === "department") navigate("/dashboard/department");
    else console.warn("Unknown role returned from backend:", backendRole);

  } catch (error) {
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <Card className="border border-gray-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Official Login</CardTitle>
            <CardDescription>Access your administrative dashboard</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role (optional, UX only) */}
              <div className="space-y-2">
                <Label htmlFor="role">Role (for display)</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select your role</option>
                  <option value="head">Head Official</option>
                  <option value="department">Department Official</option>
                </select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Demo Credentials:</p>
              <p>Email: admin@city.gov | Password: demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
