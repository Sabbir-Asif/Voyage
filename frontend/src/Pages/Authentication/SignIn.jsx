import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { googleSignIn } from "../../firebase/GoogleAuth";
import { useRef } from "react";
import {
  emailPasswordSignIn,
  sendResetEmail,
} from "../../firebase/EmailPasswordAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  // const navigateUser = () => {
  //   const { user } = useContext(AuthContext);
  //   console.log("User logged in: ", user);
  // };

  // if (user) {
  //   console.log("user: ", user);
  // } else console.log("NONE");

  const navigateUser = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  const handleEmailPasswordSignIn = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    emailPasswordSignIn(email, password);
  };

  const handleGoogleLogIn = async () => {
    try {
      const user = await googleSignIn();
      if (user) {
        console.log("Login successful: ", user);
        navigateUser(user.role);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResetPassword = async () => {
    const email = emailRef.current.value;
    if (!email) {
      console.log("Email not given.");
      return;
    }

    try {
      await sendResetEmail(email);
    } catch (error) {
      console.log("Error occurred while sending password reset email.", error);
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
