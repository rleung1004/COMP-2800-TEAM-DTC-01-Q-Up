interface signupData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface loginData {
  email: string;
  password: string;
}

const isEmpty = (string: string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email: string) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const validateSignupData = (data: signupData) => {
  let errors = {};

  if (isEmpty(data.email)) {
    Object.assign(errors, { email: "Must not be empty" });
  }
  if (!isEmail(data.email)) {
    Object.assign(errors, { email: "Must be a valid email address" });
  }

  if (isEmpty(data.password)) {
    Object.assign(errors, { password: "Must not be empty" });
  }

  if (data.password !== data.confirmPassword) {
    Object.assign(errors, { confirmPassword: "Passwords must match" });
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

const validateLoginData = (data: loginData) => {
  let errors = {};

  if (isEmpty(data.email)) {
    Object.assign(errors, { email: "Must not be empty" });
  }

  if (isEmpty(data.password)) {
    Object.assign(errors, { password: "Must not be empty" });
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

export { validateSignupData, validateLoginData };
