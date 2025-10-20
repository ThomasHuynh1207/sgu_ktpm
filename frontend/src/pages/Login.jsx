import "../styles/Login.css"

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <form>
          <input type="text" placeholder="Tên đăng nhập" required />
          <input type="password" placeholder="Mật khẩu" required />
          <button type="submit">Đăng nhập</button>
        </form>

        <p className="login-footer">
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  )
}
