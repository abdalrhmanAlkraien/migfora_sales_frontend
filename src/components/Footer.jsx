import './styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <span>
        © {new Date().getFullYear()}{' '}
        <span className="footer__brand">
          MIG<span className="footer__accent">FORA</span>
        </span>
      </span>
      <span className="footer__tagline">
        Cloud & Technology Solutions
      </span>
    </footer>
  )
}