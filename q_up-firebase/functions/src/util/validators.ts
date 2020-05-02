interface signupData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface loginData {
  email: string;
  password: string;
}

interface errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const isEmpty = (string: string) => {
  return string.trim() === "";
};

const isEmail = (email: string) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!email.match(regEx);
};

const validateSignUpData = (data: signupData) => {
  let errors: errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  }
  else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

const validateLoginData = (data: loginData) => {
  let errors: errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  }

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

export { validateSignUpData, validateLoginData, isEmail, isEmpty};
