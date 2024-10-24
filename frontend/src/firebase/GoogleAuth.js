import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import auth from "./firebase.config";

const provider = new GoogleAuthProvider();

const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const { displayName, email } = user;

    console.log("User data saved successfully");
    console.log("New user: ", displayName, email);
  } catch (error) {
    console.error("Error occurred: ", error.message);
  }
};

const userSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("Successfully logged out.");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export { googleSignIn, userSignOut };
