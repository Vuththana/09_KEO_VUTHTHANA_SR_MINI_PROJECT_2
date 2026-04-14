
export async function registerService(req) {

  const newUser = {
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    password: req.password,
    birthDate: req.birthDate
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auths/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        error: result.detail || "Registration failed",
        status: res.status
      };
    }

    return result;
  } catch (error) {
    return { error: "Connection failed." };
  }
}

export async function loginService(req) {
  const user = {
    email: req.email,
    password: req.password,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auths/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (res.status === 401) {
    throw new Error("Invalid credentials")
  }

  if (!res.ok) {
    return null;
  }
  const loggedUser = await res.json();
  return loggedUser;
}