export default async function handler(req: any, res: any) {
  // Ensure strict application/json content-type header
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "METHOD_NOT_ALLOWED",
      message: "Only POST requests are supported for team registration."
    });
  }

  const { name, email, phone, role, uid, status } = req.body || {};

  const cleanEmail = String(email || "").toLowerCase().trim();
  if (cleanEmail === "lodonexcookingacademy@gmail.com") {
    return res.status(403).json({
      success: false,
      error: "RESERVED_SUPER_ADMIN_EMAIL",
      message: "This email is permanently reserved for the Academy Super Administrator."
    });
  }

  const rawRole = String(role || "").toLowerCase().trim();
  if (rawRole === "super_admin" || rawRole === "superadmin") {
    return res.status(403).json({
      success: false,
      error: "SUPER_ADMIN_REGISTRATION_FORBIDDEN",
      message: "Super Administrator accounts cannot be created via public team registration."
    });
  }

  return res.status(200).json({
    success: true,
    message: "Registration submitted successfully. Your account is pending Super Admin approval.",
    data: {
      uid: uid || null,
      name: name || "",
      email: cleanEmail,
      phone: phone || "",
      role: rawRole || "admin",
      status: status || "pending"
    }
  });
}
