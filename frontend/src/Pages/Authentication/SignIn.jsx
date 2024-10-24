import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useEffect } from "react";
import { googleSignIn } from "../../firebase/GoogleAuth";
import {
  emailPasswordSignIn,
  sendResetEmail,
} from "../../firebase/EmailPasswordAuth";
import { AuthContext } from "../../contexts/AuthProvider"; // Adjust path if necessary

const SignIn = () => {
  const { userInfo } = useContext(AuthContext); // Access userInfo from context
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    if (userInfo) {
      // Navigate the user to a dashboard or home page after successful login
      console.log("User is already logged in:", userInfo);
      navigate("/dashboard"); // Change the route as per your app's logic
    }
  }, [userInfo, navigate]);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const user = await emailPasswordSignIn(email, password);
      if (user) {
        console.log("Login successful: ", user);
        navigate("/dashboard"); // Change to your desired route
      }
    } catch (error) {
      console.error("Error logging in with email and password", error.message);
    }
  };

  const handleGoogleLogIn = async () => {
    try {
      const user = await googleSignIn();
      if (user) {
        console.log("Login successful: ", user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Google sign-in error:", error.message);
    }
  };

  const handleResetPassword = async () => {
    const email = emailRef.current.value;
    if (!email) {
      console.log("Email not provided");
      return;
    }
    try {
      await sendResetEmail(email);
      console.log("Password reset email sent");
    } catch (error) {
      console.error("Error sending password reset email", error.message);
    }
  };

  return (
    <>
      <div className="bg-[#c1793f]">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col">
            <div className="text-center lg:text-left mb-16">
              <h1 className="text-5xl font-bold text-center">Login now!</h1>
              <p className="py-6 text-xl font-semibold">
                Welcome to the Bangla NLP Knowledge Graph, please log in.
              </p>
            </div>
            <div className="card shrink-0 w-full max-w-xl shadow-2xl">
              <form className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    className="input input-bordered"
                    ref={emailRef}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="input input-bordered"
                    ref={passwordRef}
                    required
                  />
                  <label className="label">
                    <p
                      className="label-text-alt link link-hover"
                      onClick={handleResetPassword}
                    >
                      Forgot password?
                    </p>
                  </label>
                </div>
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary border-none text-black text-base font-semibold"
                    onClick={handleEmailPasswordSignIn}
                  >
                    Login
                  </button>
                </div>
                <div className="form-control mt-2">
                  <button
                    className="btn btn-primary border-none text-white"
                    onClick={handleGoogleLogIn}
                  >
                    <FcGoogle className="text-xl" />
                    <span className="text-black font-bold">
                      Sign In With Google
                    </span>
                  </button>
                </div>
                <div className="text-center mt-5">
                  Not registered yet?{" "}
                  <span className="underline text-primary font-bold text-lg">
                    <Link to="/sign-up">Create account.</Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
