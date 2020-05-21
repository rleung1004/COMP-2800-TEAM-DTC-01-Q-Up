import React, { useCallback } from "react";
import firebase from "firebase";
import axios from "axios";
import "../styles/loginPage.scss";
import {
  GoogleLoginButton,
  FacebookLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import { Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";

const FirebaseSignup = ({ history, isLogin }: any) => {
  const oAuthSignup = useCallback(
    async (provider: firebase.auth.AuthProvider) => {
      let userData: any;
      let isNewUser: any;
      const result = await firebase
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
          userData = result.user;
          isNewUser = result.additionalUserInfo?.isNewUser;

          if (isNewUser) {
            let requestData = {
              email: userData.email,
              userId: userData.uid,
            };
            await axios
              .post("/oAuthSignup", requestData)
              .then(() => {
                history.push("/consumerRegistration");
              })
              .catch(async (err) => {
                if (err.response.status === 409) {
                  await firebase
                    .auth()
                    .currentUser?.delete()
                    .then(() => {
                      window.alert(
                        "This account already exists! Please login with the right method."
                      );
                    })
                    .catch((err) => {
                      console.error(err);
                    });
                } else {
                  console.error(err);
                  if (err.response.status === 332) {
                    window.alert(
                      "Please login again to continue, your token expired"
                    );
                    history.push("/login");
                    return;
                  }
                  window.alert(
                    "Something went wrong with sign up, please try again."
                  );
                }
              });
          }
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

      if (result === null) {
        return;
      }

      if (!userData.email) {
        await firebase
          .auth()
          .currentUser?.delete()
          .then(() => {
            window.alert(
              "You must have an email associated on your Twitter or Facebook account to sign up, please use another login method or add an email to your social media account."
            );
          })
          .catch((err) => {
            console.error(err);
          });
        return;
      }
      if (!isNewUser) {
        history.push("/login");
      }
    },
    [history]
  );

  const signInWithGoogle = async () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    await oAuthSignup(provider);
  };

  const signInWithFacebook = async () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("email");
    await oAuthSignup(provider);
  };

  const signInWithTwitter = async () => {
    let provider = new firebase.auth.TwitterAuthProvider();
    await oAuthSignup(provider);
  };

  const signInWithGithub = async () => {
    let provider = new firebase.auth.GithubAuthProvider();
    await oAuthSignup(provider);
  };

  return (
    <>
      {!!isLogin ? (
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
      ) : (
        <div className="social-btn">
          <Grid container direction="column">
            <Grid item xs={12}>
              <GoogleLoginButton onClick={signInWithGoogle}>
                Sign up with Google
              </GoogleLoginButton>
            </Grid>
            <Grid item xs={12}>
              <FacebookLoginButton onClick={signInWithFacebook}>
                Sign up with Facebook
              </FacebookLoginButton>
            </Grid>
            <Grid item xs={12}>
              <TwitterLoginButton onClick={signInWithTwitter}>
                Sign up with Twitter
              </TwitterLoginButton>
            </Grid>
            <Grid item xs={12}>
              <GithubLoginButton onClick={signInWithGithub}>
                Sign up with Github
              </GithubLoginButton>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default withRouter(FirebaseSignup);
