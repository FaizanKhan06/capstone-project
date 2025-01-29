export function storeUser(userData) {
    sessionStorage.setItem("userinfo", JSON.stringify(userData));
}

export function deleteUser() {
    sessionStorage.removeItem("userinfo");
}

export function retrieveUser() {
    return JSON.parse(sessionStorage.getItem("userinfo"));
}

