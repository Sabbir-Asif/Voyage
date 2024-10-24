import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { googleSignIn } from "../../firebase/GoogleAuth";
import { useRef, useState } from "react";
import { emailPasswordSignUp } from "../../firebase/EmailPasswordAuth";

const SignUp = () => {
  //   const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const [result, setResult] = useState(null);


  const handleEmailPasswordLogIn = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const username = usernameRef.current.value;
    emailPasswordSignUp(email, password)
      .then((data) => {
        console.log("Signed up user. From frontend: ", data);
        setResult(data);
      })
      .catch((error) =>
        console.log(
          "Error occurred while signing up with email and password: ",
          error
        )
      );

    try {
      const response = await axios.post(
        "http://localhost:3500/users/create-user",
        {
          username: username,
          email: email,
        }
      );

      console.log("User created in mongo:", response.data); // Handle success response
    } catch (error) {
      console.error("Error creating user:", error); // Handle error
    }
  };

  const handleGoogleLogIn = () => {
    googleSignIn()
      .then((data) => {
        console.log("Sign in successful.", data);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <div className="pb-10 flex flex-grow">
      <div className="hero min-h-screen bg-base-200 shadow-md">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-left mb-16">
            <h1 className="text-5xl font-bold text-center">SignUp now!</h1>
            <div className="flex justify-center">
              <p className="text-2xl font-semibold w-[55%] text-center pt-6 pb-3">
                Discover the wonders of Bangla with our Knowledge Graph. Dive
                into a world of exploration and connection.
              </p>
            </div>
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
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  className="input input-bordered"
                  ref={usernameRef}
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
                  <a
                    href="#"
                    className="text-[#d8843f] label-text-alt link link-hover"
                  >
                    Forgot password?
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary bg-[#eaba93] hover:bg-[#d8843f] border-none text-white text-base font-semibold"
                  onClick={handleEmailPasswordLogIn}
                >
                  Sign Up
                </button>
              </div>
              <div className="form-control mt-2">
                <button
                  className="btn btn-primary bg-gray-300 hover:bg-[#d8843f] border-none"
                  onClick={handleGoogleLogIn}
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-black font-bold">
                    Sign In With Google
                  </span>
                </button>
              </div>

              <div className="text-center mt-5">
                Already have an account?{" "}
                <span className="underline text-[#d8843f] font-bold text-lg">
                  <Link to="/sign-in">Login</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
