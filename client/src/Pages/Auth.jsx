
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


import { Card,CardDescription,CardContent,CardFooter ,CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Tabs,TabsContent,TabsList,TabsTrigger } from "@radix-ui/react-tabs";
import { BASE_URL } from "@/utils/url";

import { Button } from "@/components/ui/button";
import { userLoggedIn } from "../store/user.js"


const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("signup");

  const [loginInput, setLoginInput] = useState({ email: "", password: "", role: "" });
  const [signupInput, setSignUpInput] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
  });

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;

    if (type === "signup") {
      setSignUpInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const HandleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;

    try {
      setLoading(true);
      const url = type === "signup" ? "/user/register" : "/user/login";
      const res = await axios.post(`${BASE_URL}${url}`, inputData, {
        withCredentials: true,
      });

      setLoading(false);

      if (res.data.success) {
        console.log(res.data.message)
      toast.success(res.data.message)

        if (type === "signup") {
          setLoginInput({
            email: signupInput.email,
            password: signupInput.password,
            role: signupInput.role,
          });
          setSignUpInput({
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
            role: "",
          });
          setTabValue("login");
        } else {
          console.log(res.data.user)
          dispatch(userLoggedIn(res.data.user));
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      const errMsg =
        error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-[350px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">
                Create an account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input label="Name" name="name" placeholder="John Doe" value={signupInput.name} onChange={(e) => changeInputHandler(e, "signup")} />
              <Input label="Email" name="email" placeholder="john@example.com" type="email" value={signupInput.email} onChange={(e) => changeInputHandler(e, "signup")} />
              <Input label="Phone Number" name="phoneNumber" placeholder="1234567890" value={signupInput.phoneNumber} onChange={(e) => changeInputHandler(e, "signup")} />
              <Input label="Password" name="password" placeholder="********" type="password" value={signupInput.password} onChange={(e) => changeInputHandler(e, "signup")} />
              <select name="role" value={signupInput.role} onChange={(e) => changeInputHandler(e, "signup")} className="w-full border rounded px-2 py-1">
                <option value="">Select Role</option>
                <option value="Owner">Owner</option>
                <option value="Seeker">Seeker</option>
              </select>
            </CardContent>
            <CardFooter>
              <Button onClick={() => HandleRegistration("signup")} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "SignUp"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input label="Email" name="email" placeholder="john@example.com" type="email" value={loginInput.email} onChange={(e) => changeInputHandler(e, "login")} />
              <Input label="Password" name="password" placeholder="********" type="password" value={loginInput.password} onChange={(e) => changeInputHandler(e, "login")} />
              <select name="role" value={loginInput.role} onChange={(e) => changeInputHandler(e, "login")} className="w-full border rounded px-2 py-1">
                <option value="">Select Role</option>
                <option value="Owner">Owner</option>
                <option value="Seeker">Seeker</option>
              </select>
            </CardContent>
            <CardFooter>
              <Button onClick={() => HandleRegistration("login")} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
