class AuthStorage {
  static setAuth(token, user, rememberMe = true) {
    // Xóa phiên đăng nhập cũ trước
    this.removeAuth();

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));
  }

  static setToken(token, rememberMe = true) {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", token);
  }

  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  static setUser(user, rememberMe = true) {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("user", JSON.stringify(user));
  }

  static getUser() {
    const userString =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!userString) {
      return null;
    }

    try {
      return JSON.parse(userString);
    } catch {
      this.removeAuth();
      return null;
    }
  }

  static getRoles() {
    const user = this.getUser();

    return user?.roles || [];
  }

  static removeAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthStorage;
