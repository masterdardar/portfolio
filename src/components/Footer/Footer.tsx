function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="footer">
			<div className="container footer__inner">
				<hr className="rule footer__rule" />
				<div className="footer__row">
					<span className="micro">Jonah Darryl Escoto — {year}</span>
					<span className="micro footer__right">
						<a href="mailto:studio@escoto.archi" className="u-link">
							studio@escoto.archi
						</a>
						<span className="footer__sep" aria-hidden="true">
							{" · "}
						</span>
						<a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="u-link">
							LinkedIn
						</a>
						<span className="footer__sep" aria-hidden="true">
							{" · "}
						</span>
						<a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="u-link">
							Instagram
						</a>
					</span>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
