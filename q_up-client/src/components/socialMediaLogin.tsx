import React from "react";
import firebase from "firebase";
import "../styles/loginPage.scss";
import {
  GoogleLoginButton,
  FacebookLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import { Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const FirebaseLogin = ({ history }: any) => {
  const oAuthLogin = async (provider: firebase.auth.AuthProvider) => {
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        await result.user?.getIdToken().then((generatedToken) => {
          sessionStorage.setItem(
            "user",
            JSON.stringify({
              token: generatedToken,
              type: "customer",
            })
          );
        });
        let isNewUser = result.additionalUserInfo?.isNewUser;
        if (isNewUser) {
          await firebase
            .auth()
            .currentUser?.delete()
            .then(() => {
              window.alert(
                "Please go to our sign up page to sign up the first time you login."
              );
              history.push("/signup");
            })
            .catch((err) => {
              console.error(err);
            });
          window.alert("Please use sign up before using login!");
        }
        return;
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "auth/account-exists-with-different-credential") {
          window.alert(
            "This account already exists! Please login with the right method."
          );
        } else {
          window.alert(
            "You closed the popup before finalizing your sign up, please try again."
          );
        }
        return null;
      });
  };

  const signInWithGoogle = async () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    await oAuthLogin(provider);
  };

  const signInWithFacebook = async () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("email");
    await oAuthLogin(provider);
  };

  const signInWithTwitter = async () => {
    let provider = new firebase.auth.TwitterAuthProvider();
    await oAuthLogin(provider);
  };

  const signInWithGithub = async () => {
    let provider = new firebase.auth.GithubAuthProvider();
    await oAuthLogin(provider);
  };

  return (
    <>
      <div className="social-btn">
        <Grid container direction="column">
          <Grid item xs={12}>
            <GoogleLoginButton onClick={signInWithGoogle}>
              Sign in with Google
            </GoogleLoginButton>
          </Grid>
          <Grid item xs={12}>
            <FacebookLoginButton onClick={signInWithFacebook}>
              Sign in with Facebook
            </FacebookLoginButton>
          </Grid>
          <Grid item xs={12}>
            <TwitterLoginButton onClick={signInWithTwitter}>
              Sign in with Twitter
            </TwitterLoginButton>
          </Grid>
          <Grid item xs={12}>
            <GithubLoginButton onClick={signInWithGithub}>
              Sign in with Github
            </GithubLoginButton>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default withRouter(FirebaseLogin);
