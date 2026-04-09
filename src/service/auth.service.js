export async function registerService(req) {
  const isStudent = req.role === "Student";

  const newUser = {
    fullName: req.fullName,
    email: req.email,
    password: req.password,
    user_photo: req.user_photo,
    confirmPassword: req.confirmPassword,
    isStudent: isStudent,
    genId: req.role === "Instructor" ? req.generation : null,

    classId: isStudent ? req.class : null,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/register`, {
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

  if(!res.ok) {
    return null;
  }
  const loggedUser = await res.json();
  return loggedUser;
}

export async function getGenerations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/generations`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function getClassrooms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/classrooms`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return [];
  return res.json();
}