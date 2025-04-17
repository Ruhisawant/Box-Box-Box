function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#1e2330',
      borderTop: '1px solid #333d4b',
      padding: '1rem 2rem',
      color: '#ccc',
      textAlign: 'center',
      position: 'relative',
      bottom: 0,
      width: '100%',
    },
    text: {
      fontSize: '0.9rem',
    },
  };

  return (
    <footer style={styles.footer}>
      <div>
        <span style={styles.text}>
          © {new Date().getFullYear()} Box Box Box · Made with ❤️ for F1 fans
        </span>
      </div>
    </footer>
  );
}

export default Footer;