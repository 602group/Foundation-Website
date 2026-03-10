import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3 className="footer-heading">EPIC Foundation</h3>
                    <p className="footer-description">Creating once-in-a-lifetime golf experiences while supporting charitable causes.</p>
                </div>

                <div className="footer-column">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/auctions">Auctions</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4 className="footer-title">Explore</h4>
                    <ul className="footer-links">
                        <li><Link href="/travel-events">Travel &amp; Events</Link></li>
                        <li><Link href="#content">Content</Link></li>
                        <li><Link href="#faq">FAQ</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4 className="footer-title">Legal</h4>
                    <ul className="footer-links">
                        <li><Link href="#privacy">Privacy Policy</Link></li>
                        <li><Link href="#terms">Terms of Service</Link></li>
                        <li><Link href="#cookies">Cookie Policy</Link></li>
                        <li><Link href="/admin">Admin</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} EPIC Foundation. All rights reserved.</p>
            </div>
        </footer>
    );
}
