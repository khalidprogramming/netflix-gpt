import React, { useRef, useState } from "react";
import Header from "./Header";
import { formValidate } from "../utils/validate";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { AVATAR_LOGO, BACKGROUND } from "../utils/constants";


const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const [showPassword,setShowPassword] = useState(false)


  const email = useRef(null);
  const password = useRef(null);
  const fullName = useRef(null);
  

  const handleToggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  const handleValidation = () => {
    // validate

    const msg = isSignIn
      ? formValidate(email.current.value, password.current.value)
      : formValidate(
          email.current.value,
          password.current.value,
          fullName.current.value
        );
    setErrorMessage(msg);

    if (msg) return;

    if (!isSignIn) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          // console.log(user);

          updateProfile(user, {
            displayName: fullName.current.value,
            photoURL: AVATAR_LOGO,
          })
            .then(() => {
              // Profile updated!
              // ...
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
              
            })
            .catch((error) => {
              // An error occurred
              // ...
              // console.log(error);
            });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
          // ..
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)

  }

  return (
    <div>
      <Header />
      <div className="absolute -z-10">
        <img
          className=" h-screen md:h-full object-cover filter brightness-50"
          src={BACKGROUND}
          alt="background"
        />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-black bg-opacity-65 w-9/12 md:w-3/12 absolute mt-24 mx-auto right-0 left-0 flex flex-col text-white pb-20 rounded-sm"
      >
        <h2 className="mt-3 pb-10 pt-4 w-9/12 mx-auto text-3xl font-bold">
          Sign in
        </h2>
        {!isSignIn && (
          <input
            ref={fullName}
            className="mt-3 p-2 w-9/12 mx-auto rounded-md bg-gray-600"
            type="text"
            placeholder="Full Name"
          />
        )}
        <input
          ref={email}
          className="mt-3 p-2 w-9/12 mx-auto rounded-md bg-gray-600"
          type="text"
          placeholder="email address"
        />
        <input
          ref={password}
          className="mt-3 p-2 w-9/12 mx-auto rounded-md bg-gray-600"
          type={showPassword?"text":"password"}
          placeholder="password"
        />
        <div className=" flex items-center mt-1 p-2 w-9/12 mx-auto rounded-md ">
        <input id="show" type="checkbox" className=" mt-1 mr-1 cursor-pointer " onChange={toggleShowPassword}/>
        <label htmlFor="show" className=" text-gray-300 cursor-pointer">show password</label>
        </div>
       
        <p className="text-red-500 text-xs font-bold text-md mt-1 p-2 w-9/12 mx-auto">
          {errorMessage}
        </p>
        <button
          onClick={handleValidation}
          className="mt-8 p-3 w-9/12 bg-red-500 mx-auto rounded-md"
        >
          {isSignIn ? "sign in" : "sign up"}
        </button>
        <p
          className="mt-3 p-2 w-9/12 mx-auto cursor-pointer italic font-thin"
          onClick={handleToggleSignIn}
        >
          {isSignIn
            ? " New to Netflix? sign up now"
            : "Already have an account? sign in here"}
        </p>
      </form>
    </div>
  );
};

export default Login;
